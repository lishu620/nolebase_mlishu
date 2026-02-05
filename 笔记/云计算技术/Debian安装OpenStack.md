## 准备操作
### 安装基础工具
```
sudo apt install -y vim git curl wget python3-pip python3-dev libffi-dev gcc libssl-dev chrony openssh-server
```
### 配置主机名和解析
```
sudo vi /etc/hosts
```
添加如下配置
```
192.168.85.21 node01
192.168.85.22 node02
192.168.85.23 node03
```
修改主机名
```
sudo hostnamectl hostname node01
```
### 时间同步
在Node1上配置时间服务器
```
sudo vim /etc/chrony/chrony.conf
```
修改如下配置
```
pool ntp.aliyun.com iburst
allow 192.168.85.0/24
```
重启时间服务器
```
sudo systemctl restart chrony
```
客户端配置
```
sudo vim /etc/chrony/chrony.conf
```
修改如下配置
```
pool node01 iburst
```
重启服务
```
sudo systemctl restart chrony
```
成功截图
![[Pasted image 20260120142025.png]]
### 添加OpenStack官方源
安装必要的依赖工具
```
sudo apt install -y apt-transport-https ca-certificates curl gnupg2
```
添加GPG密钥
```
curl -s https://ftp-master.debian.org/keys/archive-key-12.asc | sudo gpg --dearmor -o /usr/share/keyrings/debian-openstack.gpg
```
添加OpenStack源
```
echo "deb [signed-by=/usr/share/keyrings/debian-openstack.gpg] http://deb.debian.org/debian bookworm-backports main" | sudo tee /etc/apt/sources.list.d/openstack-backports.list
```
更新软件源
```
sudo apt update
```
## 安装基础服务（Node01）
### 安装MariaDB数据库
```
sudo apt install -y mariadb-server python3-pymysql
```
配置数据库
```
sudo tee /etc/mysql/mariadb.conf.d/99-openstack.cnf > /dev/null << 'EOF' 
[mysqld] 
bind-address = 0.0.0.0 # 允许所有节点访问 
default-storage-engine = innodb 
innodb_file_per_table = 1 
max_connections = 1024 # 提升连接数，适配 OpenStack 多组件 
collation-server = utf8mb4_general_ci 
character-set-server = utf8mb4 # 支持中文 EOF
```
重启并设置数据库
```
sudo systemctl restart mariadb 
sudo mysql_secure_installation
```
### 安装RabbitMQ
```
sudo apt install -y rabbitmq-server
```
创建openstack用户
```
sudo rabbitmqctl add_user openstack 123456
```
赋予权限
```
sudo rabbitmqctl set_permissions openstack ".*" ".*" ".*"
```
验证用户
```
sudo rabbitmqctl list_users
```
![[Pasted image 20260120143540.png]]
### 安装Memcached
```
sudo apt install -y memcached python3-memcache
```
配置监听地址
```
sudo vim /etc/memcached.conf
```
修改监听为node1
```
-l 192.168.85.21
```
重启服务
```
sudo systemctl restart memcached
```
## 安装 Keystone（身份认证服务）
### 创建数据库与用户
登录数据库
```
sudo mysql -uroot -p123456
```
创建用户和密码
```
CREATE DATABASE keystone_db; 
GRANT ALL PRIVILEGES ON keystone_db.* TO 'keystone_id'@'localhost' IDENTIFIED BY 'KEYSTONE_DBPASS'; 
GRANT ALL PRIVILEGES ON keystone_db.* TO 'keystone_id'@'%' IDENTIFIED BY 'KEYSTONE_DBPASS'; 
FLUSH PRIVILEGES; 
EXIT;
```
### 安装Keystone
```
sudo apt install -y -t bookworm-backports openstack-cloud-identity apache2 libapache2-mod-wsgi-py3
```
### 配置Keystone
```
sudo vim /etc/keystone/keystone.conf
```
详细配置如下
```
[DEFAULT] 
log_file = keystone.log 
log_dir = /var/log/keystone 

[database] 
connection = mysql+pymysql://keystone_id:KEYSTONE_DBPASS@control-node/keystone_db 

[token] 
provider = fernet 

[keystone_authtoken] 
www_authenticate_uri = http://control-node:5000 
auth_url = http://control-node:5000 
memcached_servers = control-node:11211 
auth_type = password 
project_domain_name = Default 
user_domain_name = Default
project_name = service 
username = keystone 
password = KEYSTONE_PASS

[paste_deploy] 
flavor = keystone
```
### 初始化数据库和服务
```
sudo su -s /bin/bash -c "keystone-manage db_sync" keystone
```






