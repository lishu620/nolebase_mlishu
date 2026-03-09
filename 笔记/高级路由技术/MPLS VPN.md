## 配置基础IP
### CE1
```
int g0/0/0
ip add 100.64.1.1 24
int lo0
ip add 192.168.1.1 24
quit
ip route-static 0.0.0.0 0 100.64.1.254
```
### PE1
```
int g0/0/0
ip add 100.64.1.254 24
int g0/0/1
ip add 172.16.1.1 24
```
### P
```
int g0/0/0
ip add 172.16.1.2 24
int g0/0/1
ip add 172.16.2.1 24
```
### PE2
```
int g0/0/0
ip add 172.16.2.2 24
int g0/0/1
ip add 100.64.2.254 24
```
### CE2
```
int g0/0/0
ip add 100.64.2.1 24
int lo0
ip add 192.168.2.1 24
quit
ip route-static 0.0.0.0 0 100.64.2.254
```
## 运行MPLS多协议标签交换
在PE1、P、PE2上运行MPLS协议
### PE1
```
int lo0
ip add 1.1.1.1 32
quit
mpls lsr-id 1.1.1.1
mpls
mpls ldp
quit
int g0/0/1
mpls
mpls ldp
```
### P
```
int lo0
ip add 2.2.2.2 32
quit
mpls lsr-id 2.2.2.2
mpls
mpls ldp
quit
int g0/0/0
mpls
mpls ldp
int g0/0/1
mpls
mpls ldp
```
### PE2
```
int lo0
ip add 3.3.3.3 32
quit
mpls lsr-id 3.3.3.3
mpls
mpls ldp
quit
int g0/0/0
mpls
mpls ldp
```
## 配置VRF空间
在PE1和PE2上配置VRF空间
### PE1
```
ip vpn-instance VPN
ipv4-family 
route-distinguisher 1:1
vpn-target 1:1
quit
int g0/0/0
ip binding vpn-instance VPN
```
### PE2
```
ip vpn-instance VPN
ipv4-family 
route-distinguisher 1:1
vpn-target 1:1
quit
int g0/0/1
ip binding vpn-instance VPN
```
## 配置MP-BGP
### PE1
```
bgp 100
peer 3.3.3.3 as-number 100
peer 3.3.3.3 connect-interface LoopBack 0
peer 3.3.3.3 next-hop-local
ipv4-family vpnv4
peer 3.3.3.3 enable
```
### PE2
```
bgp 100
peer 1.1.1.1 as-number 100
peer 1.1.1.1 connect-interface LoopBack 0
peer 1.1.1.1 next-hop-local
ipv4-family vpnv4
peer 1.1.1.1 enable
```
## 联通空间
联通两个VPN空间


