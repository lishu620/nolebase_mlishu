
> [!NOTE] 提示
> 本教程适用于Debian/Ubuntu系

## 服务端
服务端使用一个硬盘作为NFS存储
配置教程：[Linux挂载硬盘](Linux挂载硬盘.md)
![Pasted image 20260211232047](assets/Pasted%20image%2020260211232047.png)
### 安装服务
```
sudo apt install -y nfs-kernel-server
```
### 修改配置文件
```
sudo vi /etc/exports
```
在文件末尾追加
```
/nfsage 192.168.85.0(rw,async)
```
### 重启服务
```
sudo systemctl restart nfs-server.service
```