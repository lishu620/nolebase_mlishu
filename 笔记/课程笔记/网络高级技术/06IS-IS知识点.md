## 理论知识1

ISIS的NET名称：areaID+systemID+sel，例如；49.0001.0000.0000.0001.00。AreaID是可变长ID，而SystemIS是不可变ID，Sel默认为00

Level1：内部路由器，只能在ISIS的域内互通，只能在同一区域建立LSDB

Level2：跨域路由器，可以再ISIS的所有区域互通，可以在同一区域、跨域l2路由器中建立LSDB

Level1-2：区域边界路由器，Level1路由器可以通过该路由器访问其他区域，类似与OSPF的ABR，路由器必须连续，为了维持稳定
### 支持类型

ISIS仅支持广播网络（MA）和点到点网络（P2P），OSPF支持广播网络（MA）、非广播多路访问（NBMA）、点到点网络和点（P2P）到多点网络（P2MP）
### 报文类型

OSPF有五种报文类型：Hello（建立关系）、DD（摘要）、LSA（请求）、LSU（更新）、LSack（确认）
ISIS报文：IIH（邻居）、LSP（链路状态报文）、CSNP（全序列号报文）、PSNP（部分序列包报文）
IIH-----Hello
LSP----LSA+LSack
CSNP--LSU
PSNP--DD
### 注意

ISIS的level1路由器会自动生成一条默认路由，指向本区域的level1-2路由器，便于访问ISIS的其他区域，效果和作用类似于OSPF的特殊区域（Stub）

ATT字段：用于表示Lv2的路由
## 基本配置
### 配置设备的NET
```
[Huawei]isis
[Huawei-isis-1]network-entity 49.0001.0000.0000.0001.00
```
### 接口使能ISIS
```
[Huawei-isis-1]int lo0
[Huawei-LoopBack0]isis enable 
```
### 修改路由器类型
```
[Huawei]isis
[Huawei-isis-1]is-level level-1-2
```
### 修改链路接口类型
```
[Huawei]int s2/0/0
[Huawei-Serial2/0/0]isis circuit-level level-1
```
## 理论知识2
### IIH
ISIS中的IIH在广播网络中分为L1 LAN IIH和L2 LAN IIH，点到点网络的IIH在P2P网络中只有P2P IIH
### DIS的选举
#### 在广播网络中
**在广播网络中的选举**  
在ISIS中，**DIS**是用于代表广播网络的伪节点。与OSPF的DR/BDR不同，DIS并没有BDR的概念。DIS的选举是**抢占式**的，即当一个更高优先级的路由器出现时，它会抢占DIS角色。
- **DIS选举规则**：
    1. **优先级**：DIS选举的首要因素是接口的优先级，优先级较高的路由器优先成为DIS。
	    1. **MAC地址**：当优先级相同的时候，MAC地址较大的路由器优先成为DIS。
    2. **抢占式**：DIS的选举是抢占式的，即更高优先级的路由器可以取代当前DIS的角色。
#### 在P2P网络中
- 对于点到点网络（P2P），ISIS没有DIS选举。点到点网络的邻接关系是通过两次握手建立的：一旦一个路由器收到对端发来的IIH报文，它就会单方面宣布建立邻接关系。
### 链路状态数据库的同步
#### LSP
SN：（Sequence Nunber）：LSP的序列号，从1开始累计，每发送一个LSP，SN值+1，路由收到LSP的时候可以对比SN的值来对比是否更新
ATT：标志位，用于在L1-2路由器中，当该字段值为1的时候，L1路由器就会生成一条默认路由指向发出该字段值的路由器
#### LSDB
ISIS的LSDB由收到的LSP构成
#### CSNP
CSNP是LSDB中的链路状态信息的全部内容，类似OSPF中的LSU报文，在广播网络中CSNP由DIS定时发送（默认10秒），而在点到点网络中，CSNP只在第一次邻接关系建立的时候发送
#### PSNP
PSNP是LSDB中的链路状态信息的摘要内容，类似OSPF中的DD报文
### ISIS的认证

#### 接口认证

对L1和L2的Hello报文进行认证（IIH报文认证）
#### 区域认证

对区域内的L1报文（LSP、CSNP、PSNP）进行认证
#### 路由域认证

对ISIS路由域内的L2报文进行认证
### 路由计算
#### 路由渗透

当L1路由器中有两个相同且等价的默认路由时，会自动选择某一个默认路由作为出口路由，可能会产生次优路径。通过路由渗透，**把L2的LSDB注入到L1的LSDB中**，使得L1路由器具有域外的路由信息，从而可以计算明细路由，避免次优路径

如下图是一个网络拓扑
![[Pasted image 20251023095931.png]]
路由渗透配置代码（样例）：
在AR2上：
```
[AR2]ip ip-prefix 1 permit 192.168.10.0 24
[AR2]isis
[AR2-isis-1]import-route isis level-2 into level-1 filter-policy ip-prefix 1
```
在AR3上：
```
[AR3]ip ip-prefix 1 permit 192.168.10.0 24
[AR3]isis
[AR3-isis-1]import-route isis level-2 into level-1 filter-policy ip-prefix 1
```
### ACL和前缀列表
都可以用来匹配所需要的流量或路由信息，ACL不能匹配子网掩码，前缀列表可以匹配子网掩码
- **ACL（Access Control List）**：可以用来匹配流量或路由信息。ACL不能匹配子网掩码，主要用于流量过滤。
- **前缀列表（Prefix List）**：与ACL类似，但它可以匹配子网掩码。前缀列表更适合用于路由过滤，因为它支持根据子网掩码的精确匹配来处理路由信息。
### ISIS认证
ISIS支持不同级别的认证机制，以确保网络的安全性：
- **接口认证**：对L1和L2的Hello报文（IIH报文）进行认证，防止非法路由器加入网络。
- **区域认证**：对区域内的L1报文（如LSP、CSNP、PSNP）进行认证，确保区域内的链路状态信息的合法性。
- **路由域认证**：对ISIS路由域内的L2报文进行认证，确保跨区域传递的路由信息的安全性。







































































