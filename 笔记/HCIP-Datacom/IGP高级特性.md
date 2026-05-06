---
tags:
  - HCIP-Datacom
comment: false
---
# IGP高级特性
## 实验拓扑
## 实验需求
实现部署FRR、BFD加快OSPF收敛速度；实现对OSPF出方向的LSA进行过滤的配置；实现部署区域间路由过滤，减小SPF LSDB大小。
互联接口、IP地址如上图所示，所有设备均创建Loopback0接口，其IP地址为10.0.x.x/24，其中x为设备编号。
R1、R2、R3的互联接口属于OSPF区域0，R1、R2、R3的Loopback0接口同样属于OSPF区域0，R3、R4的互联接口以及R4的Loopback0接口属于OSPF区域1。
R4、R5属于IS-IS 49.0001区域，R5为IS-IS Level-1路由器，R4为IS-IS Level-1-2路由器。
公司内部网络中有4台AR路由器，全部运行OSPF，为了控制OSPF LSDB数量，将4台AR划分到了不同的区域，其中区域1的ASBR R4与分支机构的路由器R5之间运行IS-IS。
为了加快OSPF的收敛速度，作为网络管理员的你部署了OSPF IP FRR、OSPF与BFD联动。
同时为了控制总部网络的路由条目数量，你在ABR R3上部署了路由过滤，限制进入OSPF区域0的路由。
分支机构存在访问总部网络的需求，你为分支机构下发了IS-IS的默认路由，而不是将OSPF的路由引入到IS-IS中。
### 任务思路：
1.设备IP地址配置。
2.按照规划配置OSPF。
3.按照规划配置IS-IS。
4.在R1上开启OSPF IP FRR，生成访问R4的备份路径。
5.所有OSPF设备开启全局BFD，在互联接口上启用BFD特性，之后关闭R3的GE0/0/1接口，在R1上查看与R3的OSPF邻居状态、路由状态是否能够快速切换。
6.R1、R2上创建IP地址相同的Loopback2接口，均在该接口上激活OSPF，在R3上查看OSPF路由表中是否存在等价路由，之后限制等价路由为1。
在R4上创建Loopback3并激活OSPF，在ABR R3上配置区域间路由过滤，限制R4 Loopback3接口路由向Area 0内传递。
7.在R4 IS-IS进程1中发布缺省路由。
## 实验代码
### 4.在R1上开启OSPF IP FRR，生成访问R4的备份路径。
![](assets/Pasted%20image%2020260420201208.png)

```
ospf
	frr
		loop-free-alternate
		quit
	quit
```

![](assets/Pasted%20image%2020260420201316.png)

此时通过查询路由10.0.4.4能够看到备份路由10.0.12.2已存在

查看默认路由

![697](assets/Pasted%20image%2020260420201424.png)

关闭链接路径

![](assets/Pasted%20image%2020260420201447.png)


查看新的路由

![](assets/Pasted%20image%2020260420201459.png)
### 5.所有OSPF设备开启全局BFD，在互联接口上启用BFD特性，之后关闭R3的GE0/0/1接口，在R1上查看与R3的OSPF邻居状态、路由状态是否能够快速切换。

在AR1、AR2、AR3和AR4上运行

```
bfd
	quit
ospf
	bfd all-interfaces enable
	quit
```

查看路由

![](assets/Pasted%20image%2020260420202329.png)

关闭R3的G0/0/1接口

![](assets/Pasted%20image%2020260420202422.png)

查看新的路由

![](assets/Pasted%20image%2020260420202435.png)
### 6.R1、R2上创建IP地址相同的Loopback2接口，均在该接口上激活OSPF，在R3上查看OSPF路由表中是否存在等价路由，之后限制等价路由为1。

```
int lo2
	ip add 172.16.2.1 24
	quit
ospf
	area 0
		network 172.16.2.1 0.0.0.255
		quit
	quit
```

在R3查看路由

![](assets/Pasted%20image%2020260420203000.png)

在R3上限制等价路由为1

```
ospf
	maximum load-balancing 1
	quit
```

![](assets/Pasted%20image%2020260420203700.png)

查看发现只有一条路由

在R4上创建Loopback3并激活OSPF，在ABR R3上配置区域间路由过滤，限制R4 Loopback3接口路由向Area 0内传递。

```
int lo3
	ip add 172.16.3.1 24
	ospf network-type broadcast
	quit
ospf
	area 1
		network 172.16.3.1 0.0.0.255
		quit
	quit
```

在R1查看路由

![](assets/Pasted%20image%2020260420203855.png)

在R3配置LSA过滤，显示路由传向area 0

```
acl 2000
	rule deny source 172.16.3.0 0.0.0.255
	rule permit source any
	quit
ospf
	area 1
		filter 2000 export
		quit
	quit
```

在R1查看路由发现路由不存在

![](assets/Pasted%20image%2020260420204032.png)

### 7.在R4 IS-IS进程1中发布缺省路由。

```
isis
	default-route-advertise always level-1-2
	quit
```

R5可以查看到默认路由

![](assets/Pasted%20image%2020260420204155.png)

同理也可以在R3上配置

![](assets/Pasted%20image%2020260420204256.png)

在R4可以查看到默认路由

![](assets/Pasted%20image%2020260420204308.png)