---
tags:
  - HCIA-Datacom
comment: false
---
# HCIA-综合案例
## 拓扑图
![](assets/Pasted%20image%2020260323180514.png)
## 配置说明

某公司（规模为100人左右）因业务发展需要，准备搭建一张全新的园区网络，公司新建楼栋共有3层，1楼为市场部（60人，3个房间）、研发部（15人，1个房间），2楼为行政部（10人，1个房间）、财务部（10人，1个房间），3楼为经理办公室（3人，2个房间）、会议室（1个房间）。具体需求如下：

1、每个楼层部署网络设备间，2楼设置核心机房，部署服务器等。

2、每楼层每房间部署AP，AC部署在核心机房。

3、财务部禁止访问外网。

4、合理规划VLAN、IP地址、DHCP、路由、WLAN、可靠性、NAT、安全性和运维管理。

5、完成物理拓扑设计并实施验证配置。
## 规划文档
### 网段/VLAN规划

|  说明   | VLAN |      网段      |     网关      |
| :---: | :--: | :----------: | :---------: |
| 市场部有线 | 111  | 10.1.11.0/24 | 10.1.11.254 |
| 市场部无线 | 112  | 10.1.12.0/24 | 10.1.12.254 |
| 研发部有线 | 121  | 10.1.21.0/24 | 10.1.21.254 |
| 研发部无线 | 122  | 10.1.22.0/24 | 10.1.22.254 |
| 行政部有线 | 131  | 10.1.31.0/24 | 10.1.31.254 |
| 行政部无线 | 132  | 10.1.32.0/24 | 10.1.32.254 |
| 财务部有线 | 141  | 10.1.41.0/24 | 10.1.41.254 |
| 财务部无线 | 142  | 10.1.42.0/24 | 10.1.42.254 |
| 办公室有线 | 151  | 10.1.51.0/24 | 10.1.51.254 |
| 办公室无线 | 152  | 10.1.52.0/24 | 10.1.52.254 |
| 会议室有线 | 161  | 10.1.61.0/24 | 10.1.61.254 |
| 会议室无线 | 162  | 10.1.62.0/24 | 10.1.62.254 |
| AC管理  | 100  | 10.1.0.0/24  | 10.1.0.254  |
| 设备管理  | 101  | 10.1.1.0/24  |             |
| 数据中心  |  99  | 10.0.99.0/24 | 10.0.99.254 |
### 无线规划
域管理模板：default
#### AP组列表

| AP组名称 | AP组说明 |
| :---: | :---: |
|  SCB  |  市场部  |
|  YFB  |  研发部  |
|  XZB  |  行政部  |
|  CWB  |  财务部  |
|  BGS  |  办公室  |
|  HYS  |  会议室  |
#### AP-MAC和AP名字/AP组列表

| AP名     | AP-MAC         | AP组 |
| ------- | -------------- | --- |
| SCB-AP1 | 00e0-fc86-2770 | SCB |
| SCB-AP2 | 00e0-fc7d-7ee0 |     |
| SCB-AP3 | 00e0-fca4-1500 |     |
| YFB-AP1 | 00e0-fcdd-3d60 | YFB |
| XZB-AP1 | 00e0-fcf6-2010 | XZB |
| CWB-AP1 | 00e0-fce7-6d80 | CWB |
| HYS-AP1 | 00e0-fc09-7060 | HYS |
| BGS-AP1 | 00e0-fc46-3970 | BGS |
| BGS-AP2 | 00e0-fc40-3060 |     |
## 配置代码
### 准备操作

首先关闭设备提示并重命名设备

```
undo t t
system
sysname XX
```
### 接入交换机

配置接入交换机（以1楼市场部1为例）

```
vlan batch 100 101 111 112
int e0/0/2
	port link-type trunk
	port trunk allow-pass vlan all
	port trunk pvid vlan 100
int e0/0/1
	port link-type trunk
	port trunk allow-pass vlan all
int vlanif 101
	ip add 10.1.1.11 24
	quit
```
### 汇聚交换机

配置汇聚交换机（以1楼汇聚为例）

```
vlan batch 100 101 111 112 121 122
int vlanif 101
	ip add 10.1.1.111 24
	quit
port-group access
	group-member e0/0/1 e0/0/3 to e0/0/5
	port link-type trunk
	port trunk allow-pass vlan all
	quit
int eth1
	trunkport e0/0/2
	trunkport e0/0/6
	port link-type trunk
	port trunk allow-pass vlan all
	quit
```
### 核心交换机

配置核心交换机

```
vlan batch 100 101 111 112 121 122
vlan batch 131 132 141 142 151 152 161 162
int eth1
	trunkport g0/0/1
	trunkport g0/0/7
	port link-type trunk
	port trunk allow-pass vlan all
int eth2
	trunkport g0/0/2
	trunkport g0/0/8
	port link-type trunk
	port trunk allow-pass vlan all
int eth3
	trunkport g0/0/3
	trunkport g0/0/9
	port link-type trunk
	port trunk allow-pass vlan all
int g0/0/4
	port link-type trunk
	port trunk allow-pass vlan all
int vlanif 101
	ip add 10.1.1.254 24
int vlanif 111
	ip add 10.1.11.254 24
int vlanif 112
	ip add 10.1.12.254 24
int vlanif 121
	ip add 10.1.21.254 24
int vlanif 122
	ip add 10.1.22.254 24
int vlanif 131
	ip add 10.1.31.254 24
int vlanif 132
	ip add 10.1.32.254 24
int vlanif 141
	ip add 10.1.41.254 24
int vlanif 142
	ip add 10.1.42.254 24
int vlanif 151
	ip add 10.1.51.254 24
int vlanif 152
	ip add 10.1.52.254 24
int vlanif 161
	ip add 10.1.61.254 24
int vlanif 162
	ip add 10.1.62.254 24
	quit
int g0/0/4
	port link-type trunk
	port trunk allow-pass vlan all
	quit
```
### AC配置
#### AC网络配置

配置AC管理IP和AP管理IP

```
vlan batch 100 101
dhcp enable
int vlanif 100
	ip add 10.1.0.254 24
	dhcp select int
int vlanif 101
	ip add 10.1.1.200 24
	quit
int g0/0/1
	port link-type trunk
	port trunk allow-pass vlan all
	quit
capwap source interface vlanif100
```
#### 创建域管理模板和AP组

```
wlan
	regulatory-domain-profile name default
		country-code cn
		quit
	ap-group name SCB
		regulatory-domain-profile default
```

输入Y应用域管理模板
#### 查看AP的MAC地址

```
dis arp
```

![](assets/Pasted%20image%2020260323012600.png)

其中`MAC ADDRESS`是AP的MAC地址
#### 将AP加入AP组

将AP认证模式修改为`mac-auth`

```
wlan
ap auth-mode mac-auth
```

将AP加入对应组

```
ap-id 0 ap-mac 00e0-fc69-7210
ap-name SCB-AP1
ap-group SCB
```

![](assets/Pasted%20image%2020260323183653.png)
#### 配置安全模板和SSID模板

直接在AC中刷入配置

```
wlan
	security-profile name HUAWEI
		security wpa-wpa2 psk pass-phrase huawei123 aes
		quit
	ssid-profile name SCB
		ssid SCB
		quit
	ssid-profile name YFB
		ssid YFB
		quit
	ssid-profile name XZB
		ssid XZB
		quit
	ssid-profile name CWB
		ssid CWB
		quit
	ssid-profile name BGS
		ssid BGS
		quit
	ssid-profile name HYS
		ssid HYS
		quit
	quit
```
#### 配置VAP模板

```
wlan
	vap-profile name SCB
		forward-mode direct-forward
		service-vlan vlan-id 111
		security-profile HUAWEI
		ssid-profile SCB
		quit
	vap-profile name YFB
		forward-mode direct-forward
		service-vlan vlan-id 121
		security-profile HUAWEI
		ssid-profile YFB
		quit
	vap-profile name XZB
		forward-mode direct-forward
		service-vlan vlan-id 131
		security-profile HUAWEI
		ssid-profile XZB
		quit
	vap-profile name CWB
		forward-mode direct-forward
		service-vlan vlan-id 141
		security-profile HUAWEI
		ssid-profile CWB
		quit
	vap-profile name BGS
		forward-mode direct-forward
		service-vlan vlan-id 151
		security-profile HUAWEI
		ssid-profile BGS
		quit
	vap-profile name HYS
		forward-mode direct-forward
		service-vlan vlan-id 161
		security-profile HUAWEI
		ssid-profile HYS
		quit
	quit
```
#### 启用射频

```
wlan
	ap-group name SCB
		vap-profile SCB wlan 1 radio all
		quit
	ap-group name YFB
		vap-profile YFB wlan 1 radio all
		quit
	ap-group name XZB
		vap-profile XZB wlan 1 radio all
		quit
	ap-group name CWB
		vap-profile CWB wlan 1 radio all
		quit
	ap-group name BGS
		vap-profile BGS wlan 1 radio all
		quit
	ap-group name HYS
		vap-profile HYS wlan 1 radio all
		quit
	quit
```

![](assets/Pasted%20image%2020260323183733.png)
#### 配置业务DHCP服务

```
dhcp enable
ip pool SCB
	gateway-list 10.1.11.254
	network 10.1.11.0 mask 255.255.255.0
	quit
ip pool YFB
	gateway-list 10.1.21.254
	network 10.1.21.0 mask 255.255.255.0
	quit
ip pool XZB
	gateway-list 10.1.31.254
	network 10.1.31.0 mask 255.255.255.0
	quit
ip pool CWB
	gateway-list 10.1.41.254
	network 10.1.41.0 mask 255.255.255.0
	quit
ip pool BGS
	gateway-list 10.1.51.254
	network 10.1.51.0 mask 255.255.255.0
	quit
ip pool HYS
	gateway-list 10.1.61.254
	network 10.1.61.0 mask 255.255.255.0
	quit
int vlanif 111
	dhcp select global
	quit
int vlanif 121
	dhcp select global
	quit
int vlanif 131
	dhcp select global
	quit
int vlanif 141
	dhcp select global
	quit
int vlanif 151
	dhcp select global
	quit
int vlanif 161
	dhcp select global
	quit
```
### 数据中心配置
#### 交换机配置

网络配置

```
vlan batch 99 1001
int g0/0/5
	port link-type trunk
	port trunk allow-pass vlan all
	port trunk pvid vlan 99
	quit
int g0/0/6
	port link-type access
	port default vlan 1001
	quit
int vlanif 99
	ip add 10.0.99.254 24
int vlanif 1001
	ip add 10.10.1.1 24
	quit
```

OSPF配置

```
ospf
	area 0
		network 10.0.99.0 0.0.0.255
		network 10.1.11.0 0.0.0.255
		network 10.1.21.0 0.0.0.255
		network 10.1.31.0 0.0.0.255
		network 10.1.41.0 0.0.0.255
		network 10.1.51.0 0.0.0.255
		network 10.1.61.0 0.0.0.255
		network 10.10.1.0 0.0.0.255
		quit
	quit
```

![697](assets/Pasted%20image%2020260323182517.png)
#### 出口路由配置

```
int g0/0/0
	ip add 10.10.1.2 24
	quit
ospf
	area 0
		network 10.10.1.0 0.0.0.255
		quit
	quit
```

### 配置`NAT`

```
ip route-static 0.0.0.0 0 100.1.1.254
acl 2000
	rule 10 permit source 10.1.11.0 0.0.0.255
	rule 20 permit source 10.1.21.0 0.0.0.255
	rule 30 permit source 10.1.31.0 0.0.0.255
	rule 40 permit source 10.1.51.0 0.0.0.255
	rule 50 permit source 10.1.61.0 0.0.0.255
	quit
nat add 1 100.1.1.10 100.1.1.20
int g0/0/1
	ip add 100.1.1.1 24
	nat out 2000 add 1
	quit
ospf
	import-route static
	default-route-advertise always
	quit
```
### 外网路由配置

```
int g0/0/0
	ip add 100.1.1.254 24
```

![694](assets/Pasted%20image%2020260323175308.png)

### 配置`NAT Server`

配置NAT Server指向数据中心

```
int g0/0/1
	nat server protocol tcp global 100.1.1.66 any inside 10.0.99.100 any
	nat server protocol udp global 100.1.1.66 any inside 10.0.99.100 any 
	nat server protocol icmp global 100.1.1.66 inside 10.0.99.100
	quit
```

![](assets/Pasted%20image%2020260323182401.png)
