由于现在不能通过root用户登录，因此选用sudoer用户配置
## 修改GDM配置
```
sudo vi /etc/gdm3/daemon.conf
```
在`[security]`段添加
```
AllowRoot = true
```
## 修改PAM配置
```
sudo vi /etc/pam.d/gdm-password
```
注释掉：
```
auth required pam_succeed_if.so user != root quiet_success
```
## 修改SSHCFG
```
sudo vi /etc/ssh/sshd_config
```
确保如下内容没有被注释且完全一致
```
PermitRootLogin yes
PasswordAuthentication yes
```
在修改完成GDM、PAM和SSHCFG之后重启服务和系统
```
sudo systemctl restart ssh
sudo reboot
```