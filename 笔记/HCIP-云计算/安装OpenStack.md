---
tags:
  - HCIP-云计算
comment: false
---
# 安装OpenStack
## 基础配置

[安装Ubuntu](安装Ubuntu.md)

### 部署NTP时间服务
#### 控制器(controller)

```
sudo apt install -y chrony
```

```
sudo vi /etc/chrony/chrony.conf
```

添加如下这一行

```
allow 192.168.59.0/24
```

重启服务

```
sudo service chrony restart
```

#### 客户端(node1)


```
sudo apt install -y chrony
```

```
sudo vi /etc/chrony/chrony.conf
```

注释其他`server`行，添加如下这一行

```
server controller inbrust
```

重启服务

```
sudo service chrony restart
```

![](附件/图片/HCIP-云计算/assets/Pasted%20image%2020260512094815.png)

### 适用于Ubuntu的OpenStack

这里我选择启用`OpenStack 2024.1 Caracal`，具体版本查看

https://docs.openstack.net.cn/install-guide/environment-packages-ubuntu.html

```
sudo add-apt-repository cloud-archive:caracal
```

### 适用于Ubuntu的数据库

```
sudo apt install mariadb-server python3-pymysql
```

```
sudo vi /etc/mysql/mariadb.conf.d/99-openstack.cnf
```

写入文件：

```
[mysqld]
bind-address = 192.168.59.101

default-storage-engine = innodb
innodb_file_per_table = on
max_connections = 4096
collation-server = utf8_general_ci
character-set-server = utf8
```

完成安装

```
sudo service mysql restart
```

初始化数据库

```
sudo mysql_secure_installation
```

### 适用于Ubuntu的消息队列

```
sudo apt install rabbitmq-server
```

添加OpenStack用户

```
sudo rabbitmqctl add_user openstack RABBIT_PASS
```

RABBIT_PASS需要替换

### 适用于 Ubuntu 的 Memcached

```
sudo apt install memcached python3-memcache
```

```
sudo vi /etc/memcached.conf
```

修改文件如下：

```
-l 192.168.59.101
```

重启服务

```
sudo service memcached restart
```
