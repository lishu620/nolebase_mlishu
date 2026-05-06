---
tags:
  - HCIP-Datacom
comment: false
---
# GRE Over IPSec
## 实验拓扑
![](assets/Pasted%20image%2020260413200254.png)
## 实验要求

正确配置IPSec加密和GRE隧道
## 配置代码

设备IP/路由互通配置

（ 略）
### 配置IPSec VPN

在AR1上配置

1.匹配流量

```
acl 3000
	rule permit ip source 10.0.11.0 0.0.0.255 destination 10.0.33.0 0.0.0.255
	quit
```

2.配置安全提案

```
ipsec proposal hauwei
	esp encryption-algorithm aes-256
	esp authentication-algorithm md5
	quit
```

3.配置安全策略

```
ipsec policy huawei 10 manual
	security acl 3000
	proposal huawei
	tunnel local 10.0.12.1
	tunnel remote 10.0.23.3
	sa string-key outbound esp simple huawei
	sa string-key inbound esp simple huawei
	sa spi outbound esp 12345
	sa spi inbound esp 23456
	quit
```

4.将策略应用到接口

```
int g0/0/0
	ipsec policy huawei
	quit
```

在AR3上配置

```
acl 3000
	rule permit ip source 10.0.33.0 0.0.0.255 destination 10.0.11.0 0.0.0.255
	quit
ipsec proposal hauwei
	esp encryption-algorithm aes-256
	esp authentication-algorithm md5
	quit
ipsec policy huawei 10 manual
	security acl 3000
	proposal huawei
	tunnel local 10.0.23.3
	tunnel remote 10.0.12.1
	sa string-key outbound esp simple huawei
	sa string-key inbound esp simple huawei
	sa spi outbound esp 12345
	sa spi inbound esp 23456
	quit
int g0/0/0
	ipsec policy huawei
	quit
```

查看IPSec配置

![](assets/Pasted%20image%2020260413195033.png)

未配置流量隧道转发前

![](assets/Pasted%20image%2020260413195215.png)

### 配置GRE Over IPSec

配置GRE隧道

AR1

```
int t0/0/1
	ip add 20.0.0.1 24
	tunnel-protocol gre
	source 10.0.12.1
	destination 10.0.23.3
	quit
ip route-static 10.0.33.0 24 t 0/0/1
```

AR3

```
int t0/0/1
	ip add 20.0.0.2 24
	tunnel-protocol gre
	source 10.0.23.3
	destination 10.0.12.1
	quit
ip route-static 10.0.11.0 24 t 0/0/1
```

配置流量隧道转发后

![](assets/Pasted%20image%2020260413200151.png)


































