## 创建分区
![Pasted image 20260212142400](Pasted%20image%2020260212142400.png)
## 格式化分区
![Pasted image 20260212142417](Pasted%20image%2020260212142417.png)
## 创建挂载点并创建挂载文件
```
mdkir -p /nfsage
```
修改`/etc/fstab`文件
在最后一行添加
```
/dev/sdb1       /nfsage         ext4    defaults        1       2
```
刷新系统环境并挂载
```
systemctl daemon-reload
mount -a
```
![Pasted image 20260212142608](Pasted%20image%2020260212142608.png)