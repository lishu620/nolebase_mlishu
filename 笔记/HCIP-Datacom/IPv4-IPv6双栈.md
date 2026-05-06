---
tags:
  - HCIP-Datacom
comment: false
---
# IPv4-IPv6双栈
## 实验拓扑
## 实验要求
## 实验代码
### 2.在骨干网接入层部署OSPF/OSPFv3。

R1

```
ospf
	area 0
		network 10.10.10.1 0.0.0.0
		network 10.0.12.1 0.0.0.0
		quit
	quit

ospfv3
	router-id 10.10.10.1 
	quit
interface GigabitEthernet0/0/2
	ospfv3 1 area 0
interface LoopBack0
	ospfv3 1 area 0
	quit
```

R2

```
ospf
	area 0 
		network 10.10.10.2 0.0.0.0
		network 10.0.12.2 0.0.0.0
		quit
	quit

ospfv3 
	router-id 10.10.10.2 
	quit
interface GigabitEthernet0/0/0
	ospfv3 1 area 0
interface LoopBack0
	ospfv3 1 area 0
	quit
```

R4

```
ospf
	area 0 
		network 10.0.45.4 0.0.0.0
		network 10.10.10.4 0.0.0.0
		quit
	quit

ospfv3
	router-id 10.10.10.4 
	quit
interface GigabitEthernet0/0/2
	ospfv3 1 area 0
interface LoopBack0
	ospfv3 1 area 0
	quit
```

R5

```
ospf 
	area 0 
		network 10.10.10.5 0.0.0.0
		network 10.0.45.5 0.0.0.0
		quit
	quit

ospfv3
	router-id 10.10.10.5 
	quit
interface GigabitEthernet0/0/2
	ospfv3 1 area 0
interface LoopBack0
	ospfv3 1 area 0
	quit
```

查看OSPF状态

![](assets/Pasted%20image%2020260427234003.png)

![](assets/Pasted%20image%2020260427234028.png)

查看OSPF路由

![](assets/Pasted%20image%2020260427234049.png)

![](assets/Pasted%20image%2020260427234107.png)
### 3.在骨干网核心层部署IS-IS/IS-IS（IPv6）。

在R2、R3和R4上部署IS-IS

R2

```
isis
	network-entity 49.0001.0000.0000.0002.00
	is-level level-2
	cost-style wide
	ipv6 enable topology ipv6 
	quit

interface LoopBack 0
	isis enable 
	isis ipv6 enable 
interface g0/0/2
	isis enable 
	isis ipv6 enable 
interface g0/0/1
	isis enable 
	quit
```

R3

```
isis
	network-entity 49.0001.0000.0000.0003.00
	is-level level-2
	cost-style wide
	ipv6 enable topology ipv6 
	quit

interface LoopBack 0
	isis enable 
	isis ipv6 enable 
interface g0/0/2
	isis enable 
	isis ipv6 enable 
interface g0/0/1
	isis enable 
	isis ipv6 enable 
	quit
```

R4

```
isis
	network-entity 49.0001.0000.0000.0004.00
	is-level level-2
	cost-style wide
	ipv6 enable topology ipv6 
	quit

interface LoopBack 0
	isis enable 
	isis ipv6 enable 
interface g0/0/0
	isis enable 
	isis ipv6 enable 
interface g0/0/1
	isis enable 
	quit
```

查看IS-IS

![](assets/Pasted%20image%2020260427235410.png)

![](assets/Pasted%20image%2020260427235505.png)

![](assets/Pasted%20image%2020260427235623.png)
### 4.IS-IS与OSPF双向引入，IS-IS与OSPFv3双向引入。

在R2和R4进行双向引入

R2

```
isis
	import-route ospf
	ipv6 import-route ospfv3 
	quit

ospf
	import-route isis
	quit

ospfv3 
	import-route isis 1
	quit
```

R4

```
isis
	import-route ospf
	ipv6 import-route ospfv3 
	quit

ospf
	import-route isis
	quit

ospfv3 
	import-route isis 1
	quit
```

在R1查看路由表

![](assets/Pasted%20image%2020260428000933.png)

![](assets/Pasted%20image%2020260428001218.png)
### 5.建立IBGP对等体关系。

R1

```
bgp 65100
	peer 10.10.10.2 as-number 65100
	peer 10.10.10.2 connect-interface LoopBack 0
	peer 10.10.10.2 next-hop-local
	
	peer 10.10.10.3 as-number 65100
	peer 10.10.10.3 connect-interface LoopBack 0
	peer 10.10.10.3 next-hop-local
	
	peer 10.10.10.4 as-number 65100
	peer 10.10.10.4 connect-interface LoopBack 0
	peer 10.10.10.4 next-hop-local
	
	peer 10.10.10.5 as-number 65100
	peer 10.10.10.5 connect-interface LoopBack 0
	peer 10.10.10.5 next-hop-local

	peer 2::2 as-number 65100
	peer 2::2 connect-interface LoopBack 0
	peer 3::3 as-number 65100
	peer 3::3 connect-interface LoopBack 0
	peer 4::4 as-number 65100
	peer 4::4 connect-interface LoopBack 0
	peer 5::5 as-number 65100
	peer 5::5 connect-interface LoopBack 0

	ipv6-family unicast 
		peer 2::2 enable 
		peer 2::2 next-hop-local 
		peer 3::3 enable
		peer 3::3 next-hop-local
		peer 4::4 enable
		peer 4::4 next-hop-local
		peer 5::5 enable
		peer 5::5 next-hop-local
		quit
	quit
```

R2

```
bgp 65100
	peer 10.10.10.1 as-number 65100
	peer 10.10.10.1 connect-interface LoopBack 0
	
	peer 10.10.10.3 as-number 65100
	peer 10.10.10.3 connect-interface LoopBack 0
	
	peer 10.10.10.4 as-number 65100
	peer 10.10.10.4 connect-interface LoopBack 0
	
	peer 10.10.10.5 as-number 65100
	peer 10.10.10.5 connect-interface LoopBack 0

	peer 1::1 as-number 65100
	peer 1::1 connect-interface LoopBack 0
	peer 3::3 as-number 65100
	peer 3::3 connect-interface LoopBack 0
	peer 5::5 as-number 65100
	peer 5::5 connect-interface LoopBack 0

	ipv6-family unicast 
		peer 1::1 enable 
		peer 3::3 enable
		peer 5::5 enable
		quit
	quit
```

R3

```
bgp 65100
	peer 10.10.10.1 as-number 65100
	peer 10.10.10.1 connect-interface LoopBack 0
	
	peer 10.10.10.2 as-number 65100
	peer 10.10.10.2 connect-interface LoopBack 0
	
	peer 10.10.10.4 as-number 65100
	peer 10.10.10.4 connect-interface LoopBack 0
	
	peer 10.10.10.5 as-number 65100
	peer 10.10.10.5 connect-interface LoopBack 0

	peer 2::2 as-number 65100
	peer 2::2 connect-interface LoopBack 0
	peer 1::1 as-number 65100
	peer 1::1 connect-interface LoopBack 0
	peer 4::4 as-number 65100
	peer 4::4 connect-interface LoopBack 0
	peer 5::5 as-number 65100
	peer 5::5 connect-interface LoopBack 0

	ipv6-family unicast 
		peer 2::2 enable 
		peer 1::1 enable
		peer 4::4 enable
		peer 5::5 enable
		quit
	quit
```

R4

```
bgp 65100
	peer 10.10.10.1 as-number 65100
	peer 10.10.10.1 connect-interface LoopBack 0
	
	peer 10.10.10.2 as-number 65100
	peer 10.10.10.2 connect-interface LoopBack 0
	
	peer 10.10.10.3 as-number 65100
	peer 10.10.10.3 connect-interface LoopBack 0
	
	peer 10.10.10.5 as-number 65100
	peer 10.10.10.5 connect-interface LoopBack 0

	peer 1::1 as-number 65100
	peer 1::1 connect-interface LoopBack 0
	peer 3::3 as-number 65100
	peer 3::3 connect-interface LoopBack 0
	peer 5::5 as-number 65100
	peer 5::5 connect-interface LoopBack 0

	ipv6-family unicast 
		peer 1::1 enable 
		peer 3::3 enable
		peer 5::5 enable
		quit
	quit
```

R5

```
bgp 65100
	peer 10.10.10.1 as-number 65100
	peer 10.10.10.1 connect-interface LoopBack 0
	peer 10.10.10.1 next-hop-local
	
	peer 10.10.10.2 as-number 65100
	peer 10.10.10.2 connect-interface LoopBack 0
	peer 10.10.10.2 next-hop-local
	
	peer 10.10.10.3 as-number 65100
	peer 10.10.10.3 connect-interface LoopBack 0
	peer 10.10.10.3 next-hop-local
	
	peer 10.10.10.4 as-number 65100
	peer 10.10.10.4 connect-interface LoopBack 0
	peer 10.10.10.4 next-hop-local


	peer 2::2 as-number 65100
	peer 2::2 connect-interface LoopBack 0
	peer 3::3 as-number 65100
	peer 3::3 connect-interface LoopBack 0
	peer 4::4 as-number 65100
	peer 4::4 connect-interface LoopBack 0
	peer 1::1 as-number 65100
	peer 1::1 connect-interface LoopBack 0

	ipv6-family unicast 
		peer 1::1 enable
		peer 1::1 next-hop-local
		peer 2::2 enable 
		peer 2::2 next-hop-local 
		peer 3::3 enable
		peer 3::3 next-hop-local
		peer 4::4 enable
		peer 4::4 next-hop-local

		quit
	quit
```

查看BGP邻居

![](assets/Pasted%20image%2020260428003119.png)

![](assets/Pasted%20image%2020260428003134.png)
### 6.S1、S2与R1、R5建立EBGP对等体关系，并发布IPv4与IPv6路由。

R1

```
bgp 65100
	peer 10.0.11.1 as-number 65001
	peer 2001:db8:11::1 as-number 65001

	ipv6-family unicast 
		peer 2001:db8:11::1 enable 
		quit
	quit
```

R5

```
bgp 65100
	peer 10.0.25.2 as-number 65002
	peer 2001:db8:25::2 as-number 65002

	ipv6-family unicast 
		peer  2001:db8:25::2 enable 
		quit
	quit
```

S1

```
bgp 65001
	peer 10.0.11.2 as-number 65100
	peer 2001:db8:11::2 as-number 65100
	
	network 10.0.1.1 32

	ipv6-family unicast 
		peer 2001:db8:11::2 enable 
		network 2001:db8::1 128
		quit
	quit
```

S2

```
bgp 65002
	peer 10.0.25.5 as-number 65100
	peer 2001:db8:25::5 as-number 65100
	
	network 10.0.2.1 32

	ipv6-family unicast 
		peer 2001:db8:25::5 enable 
		network 2001:db8::2 128
		quit
	quit
```

查看BGP路由

![](assets/Pasted%20image%2020260428003451.png)

测试IPv4连通性

![](assets/Pasted%20image%2020260428003512.png)

测试IPv6连通性

![](assets/Pasted%20image%2020260428003540.png)