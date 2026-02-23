## 安装K3S
通过一下命令安装K3S主节点
```
curl -sfL https://get.k3s.io | sh -s - server --cluster-init
```
安装日志如下：
```
mlishu@oecst:~$ curl -sfL https://get.k3s.io | sh -s - server --cluster-init
[INFO]  Finding release for channel stable
[INFO]  Using v1.34.3+k3s3 as release
[INFO]  Downloading hash https://github.com/k3s-io/k3s/releases/download/v1.34.3+k3s3/sha256sum-amd64.txt
[INFO]  Skipping binary downloaded, installed k3s matches hash
[INFO]  Skipping installation of SELinux RPM
[INFO]  Skipping /usr/local/bin/kubectl symlink to k3s, already exists
[INFO]  Skipping /usr/local/bin/crictl symlink to k3s, already exists
[INFO]  Skipping /usr/local/bin/ctr symlink to k3s, already exists
[INFO]  Creating killall script /usr/local/bin/k3s-killall.sh
[INFO]  Creating uninstall script /usr/local/bin/k3s-uninstall.sh
[INFO]  env: Creating environment file /etc/systemd/system/k3s.service.env
[INFO]  systemd: Creating service file /etc/systemd/system/k3s.service
[INFO]  systemd: Enabling k3s unit
Created symlink /etc/systemd/system/multi-user.target.wants/k3s.service → /etc/systemd/system/k3s.service.
[INFO]  systemd: Starting k3s
```
### 获取主节点Token
工作节点需要通过主节点Token连接到主节点上，因此需要获取并**妥善保管好主节点Token**
通过下面的命令获取主节点Token
```
sudo cat /var/lib/rancher/k3s/server/node-token
```
返回日志如下：
```
mlishu@oecst:~$ sudo cat /var/lib/rancher/k3s/server/node-token
K10f8d6f22a46ca1ad42663e4e8b043cb6281a7860013466d13ee4c8c535ab38995::server:aee58c601cd77c360398ee9df785fb25
```
可以看出，主节点的Token为：`K10f8d6f22a46ca1ad42663e4e8b043cb6281a7860013466d13ee4c8c535ab38995::server:aee58c601cd77c360398ee9df785fb25`
### 部署工作节点
在工作节点上运行以下命令
```
curl -sfL https://get.k3s.io | K3S_TOKEN=<TOKEN> sh -s - server --server https://<MASTER_IP>:6443
```
在该实例中如下：
```
curl -sfL https://get.k3s.io | K3S_TOKEN=K10f8d6f22a46ca1ad42663e4e8b043cb6281a7860013466d13ee4c8c535ab38995::server:aee58c601cd77c360398ee9df785fb25 sh -s - server --server https://192.168.85.135:6443
```
安装日志如下：
```
mlishu@VPS:~$ curl -sfL https://get.k3s.io | K3S_TOKEN=K10f8d6f22a46ca1ad42663e4e8b043cb6281a7860013466d13ee4c8c535ab38995::server:aee58c601cd77c360398ee9df785fb25 sh -s - server --server https://192.168.85.135:6443
[INFO]  Finding release for channel stable
[INFO]  Using v1.34.3+k3s3 as release
[INFO]  Downloading hash https://github.com/k3s-io/k3s/releases/download/v1.34.3+k3s3/sha256sum-amd64.txt
[INFO]  Downloading binary https://github.com/k3s-io/k3s/releases/download/v1.34.3+k3s3/k3s
[INFO]  Verifying binary download
[INFO]  Installing k3s to /usr/local/bin/k3s
[sudo] password for mlishu: 
[INFO]  Skipping installation of SELinux RPM
[INFO]  Creating /usr/local/bin/kubectl symlink to k3s
[INFO]  Creating /usr/local/bin/crictl symlink to k3s
[INFO]  Skipping /usr/local/bin/ctr symlink to k3s, command exists in PATH at /usr/bin/ctr
[INFO]  Creating killall script /usr/local/bin/k3s-killall.sh
[INFO]  Creating uninstall script /usr/local/bin/k3s-uninstall.sh
[INFO]  env: Creating environment file /etc/systemd/system/k3s.service.env
[INFO]  systemd: Creating service file /etc/systemd/system/k3s.service
[INFO]  systemd: Enabling k3s unit
Created symlink /etc/systemd/system/multi-user.target.wants/k3s.service → /etc/systemd/system/k3s.service.
[INFO]  systemd: Starting k3s
```
### 查看部署的集群节点
查看集群节点需要在主节点上运行
```
sudo k3s kubectl get nodes
```
日志如下：
```
mlishu@oecst:~$ sudo k3s kubectl get nodes
NAME    STATUS   ROLES                AGE     VERSION
oecst   Ready    control-plane,etcd   5h23m   v1.34.3+k3s3
vps     Ready    control-plane,etcd   67s     v1.34.3+k3s3
```
## 安装kuboard面板
在任意服务器上安装docker用于安装Kuboard面板
```
sudo apt install -y docker.io
```
通过docker安装面板
```
sudo docker run -d \
--restart=unless-stopped \
--name=kuboard \
-p 8081:80/tcp \
-p 10081:10081/tcp \
-e KUBOARD_ENDPOINT="http://192.168.85.135" \
-e KUBOARD_AGENT_SERVER_TCP_PORT="10081" \
-v /root/kuboard-data:/data \
swr.cn-east-2.myhuaweicloud.com/kuboard/kuboard:v3
```
将`http://192.168.85.135`修改为服务器的IP
通过浏览器访问面板
![Pasted image 20260211221154](assets/Pasted%20image%2020260211221154.png)

> [!NOTE] 提示
> 用户名：admin
> 密码：Kuboard123

### 将集群添加到面板中管理
登录面板后点击添加集群
![Pasted image 20260211221439](assets/Pasted%20image%2020260211221439.png)
选择`KubeConfig`
![Pasted image 20260211221554](assets/Pasted%20image%2020260211221554.png)
在K3S主节点输入如下命令
```
sudo cat /etc/rancher/k3s/k3s.yaml
```
返回日志如下：
```
mlishu@oecst:~$ sudo cat /etc/rancher/k3s/k3s.yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkekNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdGMyVnkKZG1WeUxXTmhRREUzTnpBM09UZzNPVGt3SGhjTk1qWXdNakV4TURnek16RTVXaGNOTXpZd01qQTVNRGd6TXpFNQpXakFqTVNFd0h3WURWUVFEREJock0zTXRjMlZ5ZG1WeUxXTmhRREUzTnpBM09UZzNPVGt3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFSQXUzSFZhZUFUMVJWYTBuS1NRbk1iNWtLUVk2YlFBVmlnTGRpUkpJVGYKUWtPa2dLMkl2WTh4VEdyNGNpOWx1SUtNdHZ2MVhVT3BFbU9Hc3VqUGlDN0ZvMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVUlMOU81c1FMV09QZEhVWGZGL1d2CldyWGJCU0F3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQUk1M0ZNZGRZOXFlZ2NqaXRsZGxXU1c0UGVKdm5wMnUKOVM5Z3JPcjNjTFNqQWlBMGV5NjBtVGJ2WVVINGhBTlpaUVV2OXVmRmtvNVZ6MWNiRzBYOVNMcmdQUT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    server: https://127.0.0.1:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
users:
- name: default
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJrVENDQVRlZ0F3SUJBZ0lJYllqRUtMR1RMUEV3Q2dZSUtvWkl6ajBFQXdJd0l6RWhNQjhHQTFVRUF3d1kKYXpOekxXTnNhV1Z1ZEMxallVQXhOemN3TnprNE56azVNQjRYRFRJMk1ESXhNVEE0TXpNeE9Wb1hEVEkzTURJeApNVEE0TXpNeE9Wb3dNREVYTUJVR0ExVUVDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGVEFUQmdOVkJBTVRESE41CmMzUmxiVHBoWkcxcGJqQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJHa2hTYms4OWxXQjl0SmkKQTFqTGhMMHduNWdKRkx6R3hmZmdoSzR0c2pnNVdrSVpLeFFFMlBoYXpNNUNxLy9CN3hSdENENzc5SjRFUTFLbApIQUZGYVoyalNEQkdNQTRHQTFVZER3RUIvd1FFQXdJRm9EQVRCZ05WSFNVRUREQUtCZ2dyQmdFRkJRY0RBakFmCkJnTlZIU01FR0RBV2dCUTZXcnBWRGp1alIyTFNlZmdzQzVIQWplMjc1VEFLQmdncWhrak9QUVFEQWdOSUFEQkYKQWlBa3hHVXd1V0daMUo2WlFnRHlzd1NZYXZ4ZEJNSDZsWit0NGI1OEZJdlNEZ0loQU05anpHaVExRnFDb0hPWgpwYmpXV0JiRGZBeSticjZqcit2WlBuc3I2eGN2Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJkekNDQVIyZ0F3SUJBZ0lCQURBS0JnZ3Foa2pPUFFRREFqQWpNU0V3SHdZRFZRUUREQmhyTTNNdFkyeHAKWlc1MExXTmhRREUzTnpBM09UZzNPVGt3SGhjTk1qWXdNakV4TURnek16RTVXaGNOTXpZd01qQTVNRGd6TXpFNQpXakFqTVNFd0h3WURWUVFEREJock0zTXRZMnhwWlc1MExXTmhRREUzTnpBM09UZzNPVGt3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFRcUJVbTFOSTlRNVp6Y29IRFR4R1J6c3FvVTE0bTFqMmVKcU1jdkQ2VHUKQjB0anRoay9vMGQyeW0xMnV3Q29PTmFxeFVMSWUzd1JIcTNSMXpsMG5lay9vMEl3UURBT0JnTlZIUThCQWY4RQpCQU1DQXFRd0R3WURWUjBUQVFIL0JBVXdBd0VCL3pBZEJnTlZIUTRFRmdRVU9scTZWUTQ3bzBkaTBubjRMQXVSCndJM3R1K1V3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUlnRjdabll3WDJWQitEaW5hT2NYdjZva3VTM1hGYVNWMUcKdEFqUnc5ZnRUWEFDSVFDYzZteklvQ2oxMzVMRG5WRTY0REQzQ2hpOVJYY21PaWxoa1BGN1RBbHMxUT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    client-key-data: LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSUdPRitpSjlCdllDbnZzS3I5VkNLbGFkTmRTVkxlWXVpZWNHY3J5S2lRUVdvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFYVNGSnVUejJWWUgyMG1JRFdNdUV2VENmbUFrVXZNYkY5K0NFcmkyeU9EbGFRaGtyRkFUWQorRnJNemtLci84SHZGRzBJUHZ2MG5nUkRVcVVjQVVWcG5RPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=
```
将除了第一行之外的所有信息输入到管理面板中
![Pasted image 20260212010721](assets/Pasted%20image%2020260212010721.png)
此时管理面板会自动匹配Context和ApiServer 地址，此时需要手动修改ApiServer地址使得面板服务器能够访问K3S主节点
![Pasted image 20260211221808](assets/Pasted%20image%2020260211221808.png)
成功添加到管理面板后，可以查看到K3S节点
![Pasted image 20260212010838](assets/Pasted%20image%2020260212010838.png)
点击进入K3S节点进行管理
![Pasted image 20260212010921](assets/Pasted%20image%2020260212010921.png)

### 添加NFS存储
点击创建存储类
![Pasted image 20260211234201](assets/Pasted%20image%2020260211234201.png)
选择NFS存储
![Pasted image 20260213010714](assets/Pasted%20image%2020260213010714.png)
输入参数
```
vers=4,minorversion=0,noresvport
```
安装PV Browers
![Pasted image 20260213010753](assets/Pasted%20image%2020260213010753.png)
自动在线安装就行
![Pasted image 20260213010813](assets/Pasted%20image%2020260213010813.png)

