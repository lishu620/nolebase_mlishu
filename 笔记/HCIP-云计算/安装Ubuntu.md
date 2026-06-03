---
tags:
  - HCIP-云计算
comment: false
---
# 安装Ubuntu

安装使用`Ubuntu 22.04`

在安装阶段修改IP为静态IP

## 更新镜像源

在非root用户运行

```
sudo sed -i 's/security.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
sudo sed -i 's/http:/https:/g' /etc/apt/sources.list
```

更新镜像源

```
sudo apt update
```

安装必要软件包

```
sudo apt install -y vim curl wget
```

更新系统

```
sudo apt upgrade
```










