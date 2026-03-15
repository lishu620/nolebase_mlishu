---
tags:
  - 云计算
---
# 赛博养虾-OpenClaw安装
## 准备操作

首先准备一台安装好Ubuntu的主机
![](Pasted%20image%2020260310174227.png)

通过`apt install` 和 `apt upgrade -y`升级系统
## 安装OpenCode

后续步骤在root用户运行
### 安装curl

后续我们通过`curl`安装OpenCode

```
apt install curl -y
```

### 安装OpenCode

```
curl -fsSL https://opencode.ai/install | bash
```

安装完成截图

![](Pasted%20image%2020260310174904.png)

添加到运行目录

```
source /root/.bashrc
```

### 运行OpenCode

输入`opencode`进入

![](Pasted%20image%2020260310175220.png)
## 安装OpenClaw

下述操作在root用户运行

```
curl -fsSL https://openclaw.ai/install.sh | bash
```

等待OpenClaw自动安装

![](Pasted%20image%2020260310175915.png)

### 故障1：NPM下载失败
![](Pasted%20image%2020260310180050.png)
由于NPM有概率下载失败，因此使用nvm进行配置



安装nvm

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

![](Pasted%20image%2020260310180546.png)

重启终端后使用nvm

![](Pasted%20image%2020260310180805.png)

手动安装node.js

```
nvm install 22.20.0
```

![](Pasted%20image%2020260310181028.png)

使用node.js

安装nrm

```
npm install -g nrm
```


用户引导，选择YES
![](Pasted%20image%2020260310181828.png)

模式选择q
![](Pasted%20image%2020260310181850.png)
选择本地ollama作为大模型
![](Pasted%20image%2020260312105445.png)








