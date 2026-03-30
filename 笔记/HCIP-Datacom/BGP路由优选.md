---
tags:
  - HCIP-Datacom
comment: false
---
# BGP路由优选
## 拓扑图
![](assets/Pasted%20image%2020260330174550.png)
## 配置需求
所有设备均创建Loopback0接口，IP地址为10.0.x.x/32，其中x为设备编号，所有设备都使用Loopback0地址作为BGP Router ID。

AS64512内运行OSPF，在互联接口（不包括连接外部AS的接口）、Loopback0接口上激活OSPF。

EBGP对等体关系基于直连接口建立，IBGP对等体关系基于Loopback0接口建立。

R1、R5上存在相同的网段，在R1、R5上将其发布到BGP，以用于BGP路由优选。

## 配置思路
1.设备IP地址配置。
2.配置AS64512内的OSPF，在互联接口（不包含连接外部AS的接口）、Loopback0接口上激活OSPF。

3.按照规划配置BGP对等体，在R1、R5上将路由发布到BGP中。

4.在R1上通过路由策略修改BGP路由172.16.1.0/24的AS_Path属性值，使得R3优选R5发布的BGP路由。

5.在R4上通过路由策略修改BGP路由172.16.2.0/24的Local_Preference属性值，使得R3优选R4通告的BGP路由。

6.在R2上通过路由策略修改BGP路由172.16.3.0/24的MED属性值，使得R3优选R5发布的BGP路由。

7.在R3上通过路由策略修改BGP路由172.16.4.0/24的preferred-value属性值，使得R3优选R4通告的BGP路由。

8.验证本地始发的BGP路由优于从对等体学习的BGP路由。在R2上创建Loopback1接口，将Loopback1接口路由发布到OSPF中，之后在R2、R3上将该接口路由发布到BGP中，R3的BGP路由表中将会存在两条关于R2 Loopback1接口的BGP路由。

9.修改Origin属性。在R1、R5上创建Loopback5接口，将接口路由发布到BGP中，验证Origin属性为IGP的BGP路由优于Origin属性为 Incomplete的BGP路由。

10.验证EBGP路由的优先级高于IBGP路由。在R1、R3上创建Loopback6接口，将Loopback6接口路由发布到BGP中，在R2上观察优选结果。

11.验证BGP优选到Nex_Hop的IGP度量值最小的路由。R2、R4之间基于环回口建立IBGP对等体关系，在R2、R3上建立Loopback7接口并将接口路由发布到BGP中，在R4上观察BGP路由优选情况。
## 配置代码

### 3.发布路由并在R3查看
![](assets/Pasted%20image%2020260330142657.png)
### 4.在R1上通过路由策略修改BGP路由172.16.1.0/24的AS_Path属性值，使得R3优选R5发布的BGP路由。

在AR1上配置

```
ip ip-prefix as-path permit 172.16.1.0 24
route-policy as-path permit node 10
	if-match ip-prefix as-path
	apply as-path 100 additive
	quit
route-policy as-path permit node 20
	quit
bgp 100
	peer 10.0.12.2 route-policy as-path export
	quit
```

![](assets/Pasted%20image%2020260330143414.png)

### 5.在R4上通过路由策略修改BGP路由172.16.2.0/24的Local_Preference属性值，使得R3优选R4通告的BGP路由。

在AR4上配置

```
ip ip-prefix locprf permit 172.16.2.0 24
route-policy locprf permit node 10
	if-match ip-prefix locprf
	apply local-preference 200
	quit
route-policy locprf permit node 20
	quit
bgp 64512
	peer 10.0.3.3 route-policy locprf export
	quit
```

![](assets/Pasted%20image%2020260330144238.png)

### 6.在R2上通过路由策略修改BGP路由172.16.3.0/24的MED属性值，使得R3优选R5发布的BGP路由。

在AR2上配置

```
ip ip-prefix med permit 172.16.3.0 24
route-policy med permit node 10
	if-match ip-prefix med
	apply cost 100
	quit
route-policy med permit node 20
	quit
bgp 64512
	peer 10.0.12.1 route-policy med import
	quit
```

![](assets/Pasted%20image%2020260330160227.png)

但是AR3还是优选10.0.2.2方向的路由，因为来自不同AS的MED值需要设置参与比较

```
bgp 64512
	compare-different-as-med 
	quit
```

![](assets/Pasted%20image%2020260330160322.png)

设置完成后，自动优选10.0.4.4方向的路由

### 7.在R3上通过路由策略修改BGP路由172.16.4.0/24的preferred-value属性值，使得R3优选R4通告的BGP路由。

```
ip ip-prefix pref permit 172.16.4.0 24
route-policy pref permit node 10
	if-match ip-prefix pref
	apply preferred-value 100
	quit
route-policy pref permit node 20
	quit
bgp 64512
	peer 10.0.4.4 route-policy pref import
	quit
```

![](assets/Pasted%20image%2020260330160613.png)

### 8.验证本地始发的BGP路由优于从对等体学习的BGP路由。在R2上创建Loopback1接口，将Loopback1接口路由发布到OSPF中，之后在R2、R3上将该接口路由发布到BGP中，R3的BGP路由表中将会存在两条关于R2 Loopback1接口的BGP路由。

在AR2上创建接口并发布路由

```
int lo1
	ip add 100.1.1.1 32
	quit
ospf
	area 0
		network 100.1.1.1 0.0.0.0
		quit
	quit
bgp 64512
	network 100.1.1.1 32
	quit
```

在AR3上发布路由

```
bgp 64512
	network 100.1.1.1 32
	quit
```

![](assets/Pasted%20image%2020260330161058.png)

在AR3上可以看到本地始发优于对等体学习

### 9.修改Origin属性。在R1、R5上创建Loopback5接口，将接口路由发布到BGP中，验证Origin属性为IGP的BGP路由优于Origin属性为 Incomplete的BGP路由。

在AR1和AR5创建Lo5接口，并发布到BGP中

```
int lo5
	ip add 172.16.5.1 24
	quit
bgp 100
	network 172.16.5.0 24
	quit
```

在AR2上配置

```
ip ip-prefix ori permit 172.16.5.0 24
route-policy ori permit node 10
	if-match ip-prefix ori
	apply origin incomplete
	quit
route-policy ori permit node 20
	quit
bgp 64512
	peer 10.0.3.3 route-policy ori export
	quit
```

![](assets/Pasted%20image%2020260330163156.png)

### 10.验证EBGP路由的优先级高于IBGP路由。在R1、R3上创建Loopback6接口，将Loopback6接口路由发布到BGP中，在R2上观察优选结果

在AR1和AR3创建Lo6接口

```
int lo6
	ip add 172.16.6.1 24
	quit
```

在AR1和AR3的BGP上发布路由

![](assets/Pasted%20image%2020260330164525.png)

由于LocPrf属性和AS-Path长度不一样，因此需要路由策略将其他属性保持一致

```
ip ip-prefix 10 permit 172.16.6.0 24
route-policy 10 permit node 10
	if-match ip-prefix 10
	apply as-path 100 additive
	quit
route-policy 10 permit node 20
	quit
route-policy 20 permit node 10
	if-match ip-prefix 10
	apply local-preference 100
	quit
route-policy 20 permit node 20
	quit
bgp 64512
	peer 10.0.3.3 route-policy 10 import
	peer 10.0.12.1 route-policy 20 import
	quit
```

![](assets/Pasted%20image%2020260330170437.png)

### 11.验证BGP优选到Nex_Hop的IGP度量值最小的路由。R2、R4之间基于环回口建立IBGP对等体关系，在R2、R3上建立Loopback7接口并将接口路由发布到BGP中，在R4上观察BGP路由优选情况

```
int lo7
	ip add 172.16.7.1 24
	quit
bgp 64512
	network 172.16.7.0 24
	quit
```

![](assets/Pasted%20image%2020260330174512.png)





















