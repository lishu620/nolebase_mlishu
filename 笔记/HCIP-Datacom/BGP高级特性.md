---
tags:
  - HCIP-Datacom
comment: false
---
# BGP高级特性
## 实验拓扑

![](assets/Pasted%20image%2020260421104933.png)
## 实验要求
IP互联地址、BGP AS号、BGP对等体关系如图所示。
R2、R4是二级RR，R1与R5为二级RR的客户端。R3是一级RR，主要接收二级RR传来的路由。S1、S2、S5的环回口用于模拟用户。
某企业存在两个分公司与一个总公司，公司共有两个业务：
OA：S1、S2、S5的Loopback0接口网段是OA业务网段。
分支之间，分支与总公司之间能够互相传递OA数据，对于OA业务相关路由需要标注始发AS。
财务：S1、S2、S5的Loopback1接口网段是财务业务网段。
由于财务业务较为机密，因此只允许分公司与总公司之间传递财务数据，分公司之间禁止传递财务数据。
网络管理员需要搭建一个满足这些需求的同时又有一定安全性的网络。

任务思路：
1.设备IP地址配置。
2.在骨干区域配置OSPF，构建底层网络。
3.在分公司与骨干网络之间部署GTSM与BGP认证，保证BGP网络安全。
4.R1、R3、R5配置与R2、R4的IBGP对等体关系，同时将R1、R3、R5配置为R2、R4的反射器客户端。
5.R3作为一级RR需要配置与R2、R4的IBGP对等体关系，同时将R2、R4配置为R3的反射器客户端。
6.在R1、R2、R3上给Loopback0接口路由打上Community值，用于标注OA业务的始发AS。
7.在R1、R5上配置路由策略，使用AS-Path Filter工具过滤Loopback1接口路由。
## 实验配置
### 实验代码
#### 4
在R2
```
bgp 65100
	peer 10.10.10.1 reflect-client
	peer 10.10.10.5 reflect-client
	reflect cluster-id 24.24.24.24
	quit
```
#### 3.在分公司与骨干网络之间部署GTSM与BGP认证，保证BGP网络安全。
在R1和S1之间配置
```
bgp 65100
	peer 10.0.11.1 as-number 65001
	peer 10.0.11.1 password cipher huawei
	peer 10.0.11.1 ebgp-max-hop 1
	quit
```
在S1上配置
```
bgp 65001
	peer 10.0.11.2 as-number 65100
	peer 10.0.11.2 password cipher huawei
	quit
```

![](assets/Pasted%20image%2020260421105743.png)

查看BGP邻居

同理配置R5-S2和R3-S5

R5

```
bgp 65100
	peer 10.0.25.2 as-number 65002
	peer 10.0.25.2 password cipher huawei
	peer 10.0.25.2 ebgp-max-hop 1
	quit
```

S2

```
bgp 65002
	peer 10.0.25.5 as-number 65100
	peer 10.0.25.5 password cipher huawei
	quit
```

R3

```
bgp 65100
	peer 10.0.35.5 as-number 65003
	peer 10.0.35.5 password cipher huawei
	peer 10.0.35.5 ebgp-max-hop 1
	quit
```

S5

```
bgp 65003
	peer 10.0.35.3 as-number 65100
	peer 10.0.35.3 password cipher huawei
	quit
```

#### 4.R1、R3、R5配置与R2、R4的IBGP对等体关系，同时将R1、R3、R5配置为R2、R4的反射器客户端。

R1

```
bgp 65100
	group cqwu internal
	peer 10.10.10.2 group cqwu
	peer 10.10.10.4 group cqwu
	peer cqwu connect-interface lo0
	peer cqwu next-hop-local
	quit
```

R2

```
bgp 65100
	group cqwu internal
	peer 10.10.10.1 group cqwu
	peer 10.10.10.3 group cqwu
	peer 10.10.10.4 group cqwu
	peer 10.10.10.5 group cqwu
	peer cqwu connect-interface lo0
	quit
```

R3

```
bgp 65100
	group cqwu internal
	peer 10.10.10.2 group cqwu
	peer 10.10.10.4 group cqwu
	peer cqwu connect-interface lo0
	peer cqwu next-hop-local
	quit
```

R4

```
bgp 65100
	group cqwu internal
	peer 10.10.10.1 group cqwu
	peer 10.10.10.2 group cqwu
	peer 10.10.10.3 group cqwu
	peer 10.10.10.5 group cqwu
	peer cqwu connect-interface lo0
	quit
```

R5

```
bgp 65100
	group cqwu internal
	peer 10.10.10.2 group cqwu
	peer 10.10.10.4 group cqwu
	peer cqwu connect-interface lo0
	peer cqwu next-hop-local
	quit
```

#### 5.R3作为一级RR需要配置与R2、R4的IBGP对等体关系，同时将R2、R4配置为R3的反射器客户端。

R3

```
bgp 65100
	peer 10.10.10.2 reflect-client
	peer 10.10.10.4 reflect-client
	quit
```

R2和R4

```
bgp 65100
	peer 10.10.10.1 reflect-client
	peer 10.10.10.5 reflect-client
	reflector cluster-id 24.24.24.24
	quit
```

#### 6.在R1、R2、R3上给Loopback0接口路由打上Community值，用于标注OA业务的始发AS。

在S1、S2和S5发布OA和财务的路由

S1

```
bgp 65001
	network 10.0.1.1 32
	network 10.1.1.1 32
	quit
ip ip-prefix 1 permit 10.0.1.1 32
route-policy huawei permit node 10
	if-match ip-prefix 1
	apply community 65001:1
route-policy huawei permit node 20
	quit
bgp 65001
	peer 10.0.11.2 route-policy huawei export
	peer 10.0.11.2 advertise-community 
	quit
```

S2

```
bgp 65002
	network 10.0.2.1 32
	network 10.1.2.1 32
	quit
ip ip-prefix 1 permit 10.0.2.1 32
route-policy huawei permit node 10
	if-match ip-prefix 1
	apply community 65002:1
route-policy huawei permit node 20
	quit
bgp 65002
	peer 10.0.25.5 route-policy huawei export
	peer 10.0.25.5 advertise-community 
	quit
```

S5

```
bgp 65003
	network 10.0.3.1 32
	network 10.1.3.1 32
	quit
ip ip-prefix 1 permit 10.0.3.1 32
route-policy huawei permit node 10
	if-match ip-prefix 1
	apply community 65003:1
route-policy huawei permit node 20
	quit
bgp 65003
	peer 10.0.35.3 route-policy huawei export
	peer 10.0.35.3 advertise-community 
	quit
```

R1

```
bgp 65100
	peer 10.0.11.1 advertise-community 
	peer cqwu advertise-community 
	quit
```

R2

```
bgp 65100
	peer cqwu advertise-community 
	quit
```

R3

```
bgp 65100
	peer 10.0.35.5 advertise-community 
	peer cqwu advertise-community 
	quit
```

R4

```
bgp 65100
	peer cqwu advertise-community 
	quit
```

R5

```
bgp 65100
	peer 10.0.25.2 advertise-community 
	peer cqwu advertise-community 
	quit
```