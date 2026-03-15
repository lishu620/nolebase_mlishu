---
tags:
  - HCIA-Datacom
---
# 二层无线组网
## 拓扑图
![547](Pasted%20image%2020260312162709.png)
## 配置说明
掌握认证AP上线配置；无线配置模板；WLAN配置基本流程，
AC处于旁挂与AP处于二层，AC作为DHCP为AP服务，
S1作为DHCP为STA服务，业务数据直接转发。
AP管理VLAN：VLAN100
STA业务VLAN：VLAN101
DHCP服务器：AC作为DHCP为AP服务，S1作为DHCP为STA服务，默认网关192.168.101.254
AP地址池：192.168.100.1-192.168.100.253
STA地址池：192.168.101.1-192.168.101.253
AC的源接口IP：VLAN100：192.168.100.254
AP组：ap-group1
VAP模板：HCIA-WLAN，域管理模板：default
国家码：中国CN
SSID模板：名称HCIA-WLAN，SSID名称：HCIA-WLAN
安全模板：名称HCIA-WLAN，策略：WPA-WPA2+PSK+AES，密码：HCIA-Datacom
VAP模板：名称HCIA-WLAN，直接转发，业务VLAN：VLAN101，引用模板：SSID、安全
## 配置代码
### 基础配置
#### 无线控制
在所有交换机/AC配置VLAN 100，AC、LSW1、LSW2和LSW3上配置
```
vlan batch 100
```
在所有接口配置Trunk模式，并放行接口
AC
```
int vlanif 100
ip add 192.168.100.254 24
int g0/0/1
port link-type trunk
port trunk allow-pass vlan 100
```
LSW1
```
int g0/0/1
port link-type trunk
port trunk allow-pass vlan 100
int g0/0/2
port link-type trunk
port trunk allow-pass vlan 100
int g0/0/3
port link-type trunk
port trunk allow-pass vlan 100
```
LSW2
```
int g0/0/1
port link-type trunk
port trunk allow-pass vlan 100
port trunk pvid vlan 100
int g0/0/2
port link-type trunk
port trunk allow-pass vlan 100
```
LSW3
```
int g0/0/1
port link-type trunk
port trunk allow-pass vlan 100
port trunk pvid vlan 100
int g0/0/3
port link-type trunk
port trunk allow-pass vlan 100
```
配置域管理模板并加入AP组
```
wlan
regulatory-domain-profile name default
country-code cn
quit
ap-group name ap-group1
regulatory-domain-profile default
```
输入Y确认
配置AC源接口
```
dhcp enable
capwap source int vlanif 100
dhcp select interface
```
静态导入AP
```
wlan
ap auth-mode mac-auth
ap-id 0 ap-mac 00e0-fc69-7210
ap-name ap1
ap-group ap-group1
```
输入Y确认
![](Pasted%20image%2020260313083529.png)
#### 模板
创建安全模板
```
wlan
security-profile name HCIA
security wpa-wpa2 psk pass-phrase huawei123 aes
```
创建SSID模板
```
wlan
ssid-profile name HCIA
ssid HCIA
```
创建VAP模板
```
wlan
vap-profile name HCIA
forward-mode direct-forward
service-vlan vlan-id 101
security-profile HCIA
ssid-profile HCIA
```
启用射频
```
wlan
ap-group name ap-group1
vap-profile HCIA wlan 1 radio all
```
结果如下图
![](Pasted%20image%2020260313084328.png)

### 数据业务
LSW1
```
dhcp enable
vlan batch 101
int vlanif 101
ip add 192.168.101.254 24
dhcp select interface
int g0/0/2
port trunk allow-pass vlan 101
int g0/0/3
port trunk allow-pass vlan 101
```
LSW2
```
vlan batch 101
int g0/0/1
port trunk allow-pass vlan 101
int g0/0/2
port trunk allow-pass vlan 101
```
LSW3
```
vlan batch 101
int g0/0/1
port trunk allow-pass vlan 101
int g0/0/3
port trunk allow-pass vlan 101
```