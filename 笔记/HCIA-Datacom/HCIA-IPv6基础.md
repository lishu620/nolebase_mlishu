---
tags:
  - HCIA-Datacom
comment: false
---
# HCIA-IPv6基础
## 拓扑图
![](assets/Pasted%20image%2020260319084903.png)
## 配置解析

1.路由器开启IPv6功能，包括接口

全局启用IPv6

```
ipv6
```

接口启用IPv6

```
ipv6 enable
```

2.自动让接口获取一个链路本地地址

```
int g0/0/1
	ipv6 add auto link-local
```

3.手工配置静态IPv6地址

```
int g0/0/1
	ipv6 add 2000:12::2 64
```

4.配置DHCPv6

```
dhcpv6 pool dhcpv6_pool
	add prefix 2000:23::/64
	dns-server 2000:23::2
int g0/0/1
	dhcpv6 server dhcpv6_pool
	quit
```

5.通过无状态地址配置方式获得地址

AR2配置

```
int g0/0/0
	undo ipv6 nd ra halt
```

AR1配置

```
int g0/0/0
	ipv6 add auto global
```

6.配置IPv6静态路由，使路由全局互通

```
ipv6 route-static 2000:23:: 64  2000:12::2
```

## 配置说明

R2的两个接口均采用静态IPv6地址配置方法

R1的GigabitEthernet0/0/0接口采用无状态地址配置

PC1采用DHCPv6的方式配置IPv6地址
## 配置代码

在AR2上配置接口地址

```
ipv6
int g0/0/0
ipv6 enable
ipv6 add auto link-local
ipv6 add 2000:12::2 64
int g0/0/1
ipv6 enable
ipv6 add auto link-local
ipv6 add 2000:23::2 64
```

启用DHCPv6服务器并在PC1上获取IPv6地址

```
dhcp enable
dhcpv6 pool dhcpv6_pool
	add prefix 2000:23::/64
	dns-server 2000:23::2
int g0/0/1
	dhcpv6 server dhcpv6_pool
	quit
```

查看IPv6地址

![](assets/Pasted%20image%2020260319085312.png)

AR2上配置无状态服务

```
int g0/0/0
	undo ipv6 nd ra halt
```

AR1上获取地址

```
int g0/0/0
	ipv6 add auto global
```

查看AR1上获取的地址

![](assets/Pasted%20image%2020260319085748.png)

配置静态路由

```
ipv6 route-static 2000:23:: 64  2000:12::2
```

访问PC1

![](assets/Pasted%20image%2020260319085934.png)