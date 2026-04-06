---
tags:
  - HCIP-Datacom
comment: false
---
# MSTP
## 实验拓扑
![](assets/Pasted%20image%2020260406221020.png)
## 实验需求

（1）SW3和SW2的链路在VLAN10中阻塞，VLAN20中转发
（2）SW3和SW1的链路在VLAN20中阻塞，VLAN10中转发
## 配置代码
### IP配置
#### AR
```
int g0/0/0
	ip add 100.1.1.1 30
int g0/0/1
	ip add 100.1.1.5 30
int lo0
	ip add 1.1.1.1 32
	quit
ospf
	area 0
		network 100.1.1.0 0.0.0.3
		network 100.1.1.4 0.0.0.3
		network 1.1.1.1 0.0.0.0
		quit
	quit
```
#### LSW1
```
vlan batch 10 20 100
int vlanif 10
	ip add 192.168.10.254 24
int vlanif 100
	ip add 100.1.1.2 30
	quit
ospf
	area 0
		network 100.1.1.0 0.0.0.3
		network 192.168.10.0 0.0.0.255
		quit
	quit
int g0/0/3
	port link-type access
	port default vlan 100
	quit
```
#### LSW2
```
vlan batch 10 20 100
int vlanif 20
	ip add 192.168.20.254 24
int vlanif 100
	ip add 100.1.1.6 30
	quit
ospf
	area 0
		network 100.1.1.4 0.0.0.3
		network 192.168.20.0 0.0.0.255
		quit
	quit
int g0/0/3
	port link-type access
	port default vlan 100
	quit
```
### 修改接口模式
#### LSW1
```
int g0/0/1
	port link-type trunk
	port trunk allow-pass vlan 10 20
int g0/0/2
	port link-type trunk
	port trunk allow-pass vlan 10 20
	quit
```
#### LSW2
```
int g0/0/1
	port link-type trunk
	port trunk allow-pass vlan 10 20
int g0/0/2
	port link-type trunk
	port trunk allow-pass vlan 10 20
	quit
```
#### LSW3
```
vlan batch 10 20
int e0/0/5
	port link-type trunk
	port trunk allow-pass vlan 10 20
int e0/0/6
	port link-type trunk
	port trunk allow-pass vlan 10 20
int e0/0/1
	port link-type access
	port default vlan 10
int e0/0/2
	port link-type access
	port default vlan 20
int e0/0/3
	port link-type access
	port default vlan 10
int e0/0/4
	port link-type access
	port default vlan 20
```
### MSTP域配置
```
stp region-configuration
region-name gyy
	instance 1 vlan 10
	instance 2 vlan 20
	revision-level 1
	active region-configuration
	quit
stp enable
stp mode mstp
```
配置VLAN10根桥
```
stp instance 1 root primary
stp instance 1 root secondary
```
配置VLAN20根桥
```
stp instance 2 root primary
stp instance 2 root secondary
```
## 测试
查看根桥
![](assets/Pasted%20image%2020260406213828.png)
访问1.1.1.1
![](assets/Pasted%20image%2020260406213853.png)
![](assets/Pasted%20image%2020260406213904.png)









