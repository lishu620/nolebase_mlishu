---
tags:
  - HCIP-Datacom
comment: false
---
# MPLS
## 实验拓扑
![](assets/Pasted%20image%2020260506104331.png)
## 实验要求

完成MPLS配置
## 实验配置

配置接口IP

### 配置LSR-ID

配置LSR-ID，全局使能MPLS

R1

```
mpls lsr-id 1.1.1.1
mpls
	quit

interface g0/0/0
	mpls
	quit
	
```

R2

```
mpls lsr-id 2.2.2.2
mpls
	quit

interface g0/0/0
	mpls
interface g0/0/1
	mpls
	quit
	
```

R3

```
mpls lsr-id 3.3.3.3
mpls
	quit

interface g0/0/0
	mpls
interface g0/0/1
	mpls
	quit

```

R4

```
mpls lsr-id 4.4.4.4
mpls
	quit

interface g0/0/0
	mpls
	quit

```

### 配置静态LSP

配置静态LSP并激活MPLS的转发

R1

```
static-lsp ingress 1234 destination 192.168.2.0 24 nexthop 12.0.0.2 out-label 120
static-lsp egress 4321 incoming-interface g0/0/0 in-label 210
ip route-static 192.168.2.0 24 12.0.0.2
```

R2

```
static-lsp transit 1234 incoming-interface g0/0/0 in-label 120 nexthop 23.0.0.3 out-label 230
static-lsp transit 4321 incoming-interface g0/0/1 in-label 320 nexthop 12.0.0.1 out-label 210
```

R3

```
static-lsp transit 1234 incoming-interface g0/0/0 in-label 230 nexthop 34.0.0.4 out-label 340
static-lsp transit 4321 incoming-interface g0/0/1 in-label 430 nexthop 23.0.0.2 out-label 320
```

R4

```
static-lsp egress 1234 incoming-interface g0/0/0 in-label 340
static-lsp ingress 4321 destination 192.168.1.0 24 nexthop 34.0.0.3 out-label 430
ip route-static 192.168.1.0 24 34.0.0.3
```

### 配置动态的MPLS LDP协议

配置IGP路由使得TCP可达

R1

```
ospf
	area 0
		network 12.0.0.0 0.0.0.255
		network 1.1.1.1 255.255.255.255
		quit
	quit
```


R2

```
ospf
	area 0
		network 12.0.0.0 0.0.0.255
		network 23.0.0.0 0.0.0.255
		network 2.2.2.2 255.255.255.255
		quit
	quit
```

R3

```
ospf
	area 0
		network 34.0.0.0 0.0.0.255
		network 23.0.0.0 0.0.0.255
		network 3.3.3.3 255.255.255.255
		quit
	quit
```

R4

```
ospf
	area 0
		network 34.0.0.0 0.0.0.255
		network 4.4.4.4 255.255.255.255
		quit
	quit
```

### 激活MPLS和MPLS LDP

配置MPLS和MPLS LDP的全局使能，MPLS和MPLS LDP的接口使能

R1

```
mpls lsr-id 1.1.1.1
mpls
	lsp-trigger all
	quit
mpls ldp
	quit

interface g0/0/0
	mpls
	mpls ldp
	quit
	
ospf
	area 0
		network 192.168.1.0 0.0.0.255
		quit
	quit

```

R2

```
mpls lsr-id 2.2.2.2
mpls
	quit
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

R3

```
mpls lsr-id 3.3.3.3
mpls
	quit
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

R4

```
mpls lsr-id 4.4.4.4
mpls
	lsp-trigger all
	quit
mpls ldp
	quit

interface g0/0/0
	mpls
	mpls ldp
	quit

ospf
	area 0
		network 192.168.2.0 0.0.0.255
		quit
	quit

```

### 查看路由器的LSP

![](assets/Pasted%20image%2020260506105630.png)

![](assets/Pasted%20image%2020260506105645.png)











