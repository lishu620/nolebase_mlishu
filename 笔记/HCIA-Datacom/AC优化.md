---
tags:
  - HCIA-Datacom
comment: false
---
# AC优化


> [!NOTE] AC内存计算估计值
> 每个AP对应AC需要100MB内存，加上本机需要200MB内存，因此正常（未修改）的带机量为4台AP，在10AP的环境中，需要100x10+200=1200MB左右

通过`管理员模式`运行`Oracle VM VirtualBox`

![](assets/Pasted%20image%2020260323175924.png)

选择`WLAN_AC_Base`

![](assets/Pasted%20image%2020260323180000.png)

点击设置

![](assets/Pasted%20image%2020260323180015.png)

选择`系统`对虚拟内存进行配置，将内存大小设置到`2048 MB`，处理器数量设置成2

![](assets/Pasted%20image%2020260323180044.png)

![](assets/Pasted%20image%2020260323180129.png)

点击`OK`保存配置，重启主机





