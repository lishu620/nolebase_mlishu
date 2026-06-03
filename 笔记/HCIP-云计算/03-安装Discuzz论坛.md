---
tags:
  - HCIP-云计算
comment: false
---
# 03-安装Discuzz论坛

## 0.准备操作

上传系统镜像
![[Pasted image 20260526093346.png]]

创建业务交换
![[Pasted image 20260526110406.png]]

![[Pasted image 20260526110442.png]]

![[Pasted image 20260526110453.png]]

![[Pasted image 20260526110540.png]]

![[Pasted image 20260526110700.png]]

## 1.创建数据库
### 创建虚拟机

创建虚拟机文件
![[Pasted image 20260526093541.png]]

修改配置
![[Pasted image 20260526093715.png]]

确认配置
![[Pasted image 20260526093732.png]]
### 安装系统

修改挂载的光驱
![[Pasted image 20260526093839.png]]

开始安装系统
![[Pasted image 20260526093915.png]]

修改Root密码
![[Pasted image 20260526094052.png]]

创建一个用户
![[Pasted image 20260526094129.png]]

配置静态IP
![[Pasted image 20260526094232.png]]

检查内网互通
![[Pasted image 20260526094254.png]]

最后进行配置检查
![[Pasted image 20260526094307.png]]

重启并登录系统
![[Pasted image 20260526094856.png]]

### 远程登录并配置

由于Root权限过高，因此选择使用创建的用户账户进行配置
![[Pasted image 20260526095033.png]]

#### 系统配置与更新

修改主机名
![[Pasted image 20260526095405.png]]

更新系统
![[Pasted image 20260526095641.png]]

#### 克隆出业务虚拟机
![[Pasted image 20260526100926.png]]

修改配置
![[Pasted image 20260526100941.png]]

检查配置
![[Pasted image 20260526100954.png]]

修改IP和主机名
![[Pasted image 20260526101618.png]]

通过nmtui修改IP
![[Pasted image 20260526101506.png]]

#### 安装数据库
![[Pasted image 20260526102327.png]]

启用服务并设置开机自启
![[Pasted image 20260526102433.png]]

初始化数据库
![[Pasted image 20260526102523.png]]

登录数据库
![[Pasted image 20260526102553.png]]

创建数据库与数据库用户
![[Pasted image 20260526110009.png]]

修改监听的网络接口
![[Pasted image 20260526103116.png]]

放行端口
![[Pasted image 20260526104732.png]]
### 业务服务器配置

安装Nginx、PHP
![[Pasted image 20260526103332.png]]

![[Pasted image 20260526103913.png]]
设置开机自启
![[Pasted image 20260526103936.png]]

下载Discuz
![[Pasted image 20260526103614.png]]

将文件放在nginx业务根目录
![[Pasted image 20260526104003.png]]

前端访问
![[Pasted image 20260526104601.png]]

解决错误
![[Pasted image 20260526104815.png]]

![[Pasted image 20260526104821.png]]

解决错误
![[Pasted image 20260526104926.png]]

![[Pasted image 20260526105444.png]]

![[Pasted image 20260526105458.png]]

![[Pasted image 20260526105634.png]]

![[Pasted image 20260526105707.png]]

![[Pasted image 20260526110021.png]]

![[Pasted image 20260526110035.png]]

![[Pasted image 20260526110229.png]]