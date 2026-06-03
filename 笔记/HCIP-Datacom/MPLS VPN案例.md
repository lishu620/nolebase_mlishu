---
tags:
  - HCIP-Datacom
comment: false
---
# MPLS VPN案例
## 实验拓扑
![](assets/Pasted%20image%2020260506202947.png)
## 实验要求

1、基本配置与IP编址;
2、配置运营商网络单区域OSPF;
3、配置运营商网络边缘设备的VPN实例,分配RD和RT；
4、配置企业网络边缘设备与运营商网络边缘设备的路由传递；
5、配置运营商网络建立IBGP的邻居关系；
6、配置企业B非BGP路由传递的路由注入；
7、配置运营商网络MPLS LDP协议；
8、验证连通性。
## 实验配置

基本配置与IP编址

### 配置运营商网络单区域OSPF

PE1

```
ospf
	area 0
		network 10.0.4.0 0.0.0.255
		network 1.1.1.1 0.0.0.0
		quit
	quit
```

P1

```
ospf
	area 0
		network 10.0.4.0 0.0.0.255
		network 10.0.5.0 0.0.0.255
		network 2.2.2.2 0.0.0.0
		quit
	quit
```

PE2

```
ospf
	area 0
		network 10.0.5.0 0.0.0.255
		network 3.3.3.3 0.0.0.0
		quit
	quit
```


### 配置运营商网络边缘设备的VPN实例,分配RD和RT

PE1

```
ip vpn-instance VPN1
	route-distinguisher 1:1
		vpn-target 100:3 import-extcommunity 
		vpn-target 100:1 export-extcommunity 
		quit
	quit

ip vpn-instance VPN2
	route-distinguisher 2:2
		vpn-target 100:3 import-extcommunity
		vpn-target 100:2 export-extcommunity
		quit
	quit

ip vpn-instance VPN4
	route-distinguisher 4:4
		vpn-target 200:1 both 
		quit
	quit

interface g0/0/2
	ip binding vpn-instance VPN1
	ip address 10.0.1.2 24
	quit

interface g1/0/0
	ip binding vpn-instance VPN2
	ip address 10.0.2.2 24
	quit

interface g0/0/1
	ip binding vpn-instance VPN4
	ip address 10.0.3.2 24
	quit
```

PE2

```
ip vpn-instance VPN3
	route-distinguisher 3:3
		vpn-target 100:1 100:2 import-extcommunity 
		vpn-target 100:3 export-extcommunity 
		quit
	quit

ip vpn-instance VPN5
	route-distinguisher 5:5
		vpn-target 200:1 both
		quit
	quit

interface g0/0/1
	ip binding vpn-instance VPN3
	ip address 10.0.6.1 24
	quit

interface g0/0/2
	ip binding vpn-instance VPN5
	ip address 10.0.7.1 24
	quit
```

查看VPN实例

![](assets/Pasted%20image%2020260506204358.png)

![](assets/Pasted%20image%2020260506204449.png)

### 配置企业网络边缘设备与运营商网络边缘设备的路由传递

#### 通过BGP传递

PE1

```
bgp 100
	ipv4-family vpn-instance VPN1
		peer 10.0.1.1 as-number 10
		quit
		
	ipv4-family vpn-instance VPN2
		peer 10.0.2.1 as-number 20
		quit
	quit
	
```

PE2

```
bgp 100
	ipv4-family vpn-instance VPN3
		peer 10.0.6.2 as-number 30
		quit
	quit
```

CE1

```
bgp 10
	peer 10.0.1.2 as-number 100
	network 192.168.1.1 32
	quit
```

CE2

```
bgp 20
	peer 10.0.2.2 as-number 100
	network 192.168.2.1 32
	quit
```

CE4

```
bgp 30
	peer 10.0.6.1 as-number 100
	network 192.168.3.1 32
	quit
```

在CE端查看BGP邻居关系

![](assets/Pasted%20image%2020260506204944.png)

在PE端查看实例的邻居关系

![](assets/Pasted%20image%2020260506205053.png)

#### 通过ISIS传递

PE1

```
isis vpn-instance VPN4
	network-entity 49.0001.0000.0000.0001.00
	quit

int g0/0/1
	isis enable
	quit
```

CE3

```
isis
	network-entity 49.0001.0000.0000.0002.00
	quit
	
int g0/0/0
	isis enable
int lo0
	isis enable
	quit
```

在PE1查看VPN路由

![](assets/Pasted%20image%2020260506205722.png)

#### 通过静态路由传递

CE5

```
ip route-static 0.0.0.0 0.0.0.0 10.0.7.1
```

PE2

```
ip route-static vpn-instance VPN5 192.168.3.1 32 10.0.7.2
```

在PE2查看VPN路由

![](assets/Pasted%20image%2020260506205938.png)

### 配置运营商网络建立IBGP的邻居关系

PE1

```
bgp 100
	peer 3.3.3.3 as-number 100
	peer 3.3.3.3 connect-interface LoopBack 0
	ipv4-family vpnv4 
		peer 3.3.3.3 enable 
		quit
	quit
```

PE2

```
bgp 100
	peer 1.1.1.1 as-number 100
	peer 1.1.1.1 connect-interface LoopBack 0
	ipv4-family vpnv4 
		peer 1.1.1.1 enable 
		quit
	quit
```

### 配置企业B非BGP路由传递的路由注入

PE1

```
bgp 100
	ipv4 vpn-instance VPN4
		import-route isis 1
		quit
	quit

isis vpn-instance VPN4
	import-route bgp
	quit
```

PE2

```
bgp 100
	ipv4 vpn-instance VPN5
		import-route static 
		quit
	quit
```

### 配置运营商网络MPLS LDP协议

PE1

```
mpls lsr-id 1.1.1.1
mpls
	mpls ldp
	quit

interface g0/0/0
	mpls
	mpls ldp
	quit
```

P1

```
mpls lsr-id 2.2.2.2
mpls
mpls ldp
	quit

interface g0/0/0
	mpls
	mpls ldp
interface g0/0/1
	mpls
	mpls ldp
	quit
```

PE2

```
mpls lsr-id 3.3.3.3
mpls
mpls ldp
	quit

interface g0/0/0
	mpls
	mpls ldp
	quit
```

### 验证连通性。

![](assets/Pasted%20image%2020260506210650.png)

![](assets/Pasted%20image%2020260506210703.png)

![](assets/Pasted%20image%2020260506210735.png)
















































