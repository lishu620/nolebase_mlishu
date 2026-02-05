## 服务器配置
### 配置接口IP
进入资源分配-端口
![[Pasted image 20251028115525.png]]

![[Pasted image 20251028115547.png]]
将H0端口配置成仅主机模式的地址，这里配置成`59.168.1.101`
![[Pasted image 20251028115646.png]]

修改后的效果：
![[Pasted image 20251028115703.png]]

可以看到H0的IPv4地址和掩码信息
### 创建硬盘域
![[Pasted image 20251028130727.png]]
### 创建存储池
![[Pasted image 20251028130750.png]]
### 创建LUN
只需要创建大小为5G的LUN组即可
![[Pasted image 20251028130812.png]]
### 加入LUN组
![[Pasted image 20251028130852.png]]
## Windows主机配置
进入iSCSI发现程序
![[Pasted image 20251028130932.png]]
在发现中创建发现门户
在目标中连接
![[Pasted image 20251028131009.png]]
### 创建主机
![[Pasted image 20251028131052.png]]
### 加入启动器
![[Pasted image 20251028131119.png]]
### 加入主机组
![[Pasted image 20251028131144.png]]
### 创建映射
![[Pasted image 20251028131214.png]]

重新连接后即可看到硬盘
![[Pasted image 20251028131300.png]]
之后就可以正常操作该硬盘（类似本地）
![[Pasted image 20251028131411.png]]


将文件放入：
![[Pasted image 20251028131426.png]]

就可以在主页看到
![[Pasted image 20251028131455.png]]

























