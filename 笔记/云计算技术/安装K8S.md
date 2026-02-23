## 准备操作
### 卸载swap分区
Kubernetes 的机器不能有 swap 分区，所以要卸载 swap 分区。
```
swapoff -a
```
然后编辑 `/etc/fstab` 文件，注释或删除 swap 那行。
```
vi /etc/fstab
```
### 开启转发
```
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```
### 卸载非官方的Docker
```
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
```
## 安装Docker
一键安装Docker
```
bash <(curl -sSL https://linuxmirrors.cn/docker.sh)
```
启动Docker并设置开机自启
```
sudo systemctl enable docker --now
```
## 安装Containerd
在所有节点安装
```
apt install containerd -y
```
初始化配置
```
containerd config default | sudo tee /etc/containerd/config.toml >/dev/null 2>&1
```
配置镜像源
```
sed -i "s/SystemdCgroup = false/SystemdCgroup = true/g" /etc/containerd/config.toml sed -i "s/sandbox_image = \"registry\.k8s\.io\/pause:3\.6\"/sandbox_image = \"registry\.aliyuncs\.com\/google_containers\/pause:3\.9\"/g" /etc/containerd/config.toml
```
重启服务
```
systemctl enable containerd 
systemctl restart containerd
```
## 安装K8S工具
所有节点机器都执行。
安装 kubeadm、kubelet、kubectl 工具
- `kubectl`: 用以控制集群的客户端工具
- `kubeadm`: 用以构建一个 k8s 集群的官方工具
- `kubelet`: 工作在集群的每个节点，负责容器的一些行为如启动
### 安装源和GPG证书
安装GPG工具
```
apt install gpg -y
```
导入证书密钥
```
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```
导入证书
```
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```
更新镜像源
```
apt update
```
### 安装K8S工具
```
apt install kubelet kubeadm kubectl -y
```
### 检查版本
```
kubeadm version
kubelet --version
kubectl version
```
![Pasted image 20260120170936](assets/Pasted%20image%2020260120170936.webp)
## 拉取K8S镜像
```
kubeadm config images pull --image-repository registry.aliyuncs.com/google_containers
```
查看镜像
```
crictl images
```
![Pasted image 20260120171605](assets/Pasted%20image%2020260120171605.webp)
## 部署Master节点
使用 kubeadm 初始化 master 节点或首节点。
- 不要在非 master 节点上运行 `kubeadm init`，如果在非 master 节点上运行了 `kubeadm init`，它会尝试初始化该节点为一个新的控制平面节点，导致该节点不能正常加入现有集群。
- 如果要将一个非 master 节点加入到现有的 Kubernetes 集群中并，成为一个 worker 节点，在 master 节点上生成`kubeadm join` 命令， 并在非 master 节点（worker 节点）上运行即可。
- `--image-repository` 指定 docker 镜像的仓库地址，用于下载 kubernetes 组件所需的容器镜像。因为 k8s 的很多镜像都在外网无法访问，所以这里使用了阿里云容器镜像地址。注意，即使提前拉取了镜像，这里也要指定相同的仓库，否则还是会拉取官方镜像如果访问不了导致拉取失败。
- `--ignore-preflight-errors=NumCpu`如果你的服务器不足 2 核 cpu 可以添加，来忽略错误。
- 如果你在 init 后因发生任何异常导致初始化终止了，可以使用 `kubeadm reset -f` 强制重置之后再重新进行初始化，注意该命令会将此 master 完全重置。
- 命令 kubeam init 完整参数见官方文档 https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/
### 初始化kubeadm
```
kubeadm init --image-repository registry.aliyuncs.com/google_containers
```
出现这个绿色的就表示初始化完成
![Pasted image 20260120171950](assets/Pasted%20image%2020260120171950.webp)
查看服务运行状态
![Pasted image 20260120172111](assets/Pasted%20image%2020260120172111.webp)
按上2图执行如下命令
```
mkdir -p $HOME/.kube 
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config 
sudo chown $(id -u):$(id -g) $HOME/.kube/config 
export KUBECONFIG=/etc/kubernetes/admin.conf
```
查看已加入的节点
```
kubectl get nodes
```
![Pasted image 20260120200804](assets/Pasted%20image%2020260120200804.webp)
查看集群状态
```
kubectl get cs
```
![Pasted image 20260120200832](assets/Pasted%20image%2020260120200832.webp)
## 部署worker节点
获取新的certificate-key
```
kubeadm init phase upload-certs --upload-certs
```
![Pasted image 20260120202016](assets/Pasted%20image%2020260120202016.webp)
获取添加worker节点的命令
```
kubeadm token create --print-join-command
```
![Pasted image 20260120202818](assets/Pasted%20image%2020260120202818.webp)
记住这个密钥
```
kubeadm join 192.168.85.21:6443 --token 8zrdlu.3yk0pkfiuvt9iooh --discovery-token-ca-cert-hash sha256:7715d5c0a719b5e39d35565d804f6ea855e78a7addf0afe0f902614c72e00e98
```
将该密钥输入到需要加入集群的主机中
![Pasted image 20260120204631](assets/Pasted%20image%2020260120204631.webp)
让worker节点可以查询
```
mkdir ~/.kube && cp /etc/kubernetes/kubelet.conf ~/.kube/config
```
查看加入的节点
![Pasted image 20260120204622](assets/Pasted%20image%2020260120204622.webp)
现在有了 master 和 node 节点，但是所有节点状态都是 `NotReady`，这是因为没有CNI网络插件
## 安装CNI网络插件
**安装 CNI 网络插件在所有节点机器执行。**
Kubernetes 需要网络插件 (Container Network Interface: CNI) 来提供集群内部和集群外部的网络通信。
常用的 k8s 网络插件有 Flannel、Calico、Canal、Weave-net 等。
Calico 性能更强，Flannel 更简单方便。
这里选择 Calico，注意版本需要匹配 k8s 版本，否则无法应用
https://archive-os-3-28.netlify.app/calico/3.28/getting-started/kubernetes/requirements/#kubernetes-requirements


```
wget --no-check-certificate https://raw.githubusercontent.com/projectcalico/calico/v3.28.1/manifests/calico.yaml
sed -i 's#docker.io/calico#registry.aliyuncs.com/google_containers/calico#g' calico.yaml
kubectl apply -f calico.yaml
```

```
kubectl delete -f calico.yaml
```
### 查看pod状态






