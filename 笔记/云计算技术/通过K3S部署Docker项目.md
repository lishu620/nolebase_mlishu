由于K3S通过yml文件部署，因此需要自己写yml文件
## Navidrome
### 创建Navidrome.yml文件
详细文件内容如下：
```
# 1. PVC - 存储音乐文件（绑定 NFS） 
apiVersion: v1 
kind: PersistentVolumeClaim 
metadata: 
	name: navidrome-music # 音乐文件PVC名称 
spec: 
	accessModes: 
		- ReadWriteMany # NFS支持多节点共享，必须用这个模式 
	resources: 
		requests: 
			storage: 10Gi # 根据你的音乐文件大小调整，比如20Gi/50Gi 
		storageClassName: nfsage # 核心：使用你的NFS存储类 

--- # 2. PVC - 存储Navidrome配置/数据库（绑定 NFS） 
apiVersion: v1 
kind: PersistentVolumeClaim 
metadata: 
	name: navidrome-data # 配置数据PVC名称 
spec: 
	accessModes: 
		- ReadWriteMany 
	resources: 
		requests: 
		  storage: 1Gi # 配置数据占用小，1Gi足够 
		storageClassName: nfsage # 核心：使用你的NFS存储类 
  
--- # 3. Deployment - Navidrome主程序 
apiVersion: apps/v1 
kind: Deployment 
metadata: 
name: navidrome 
spec: replicas: 1 
# 单实例即可 selector: matchLabels: app: navidrome template: metadata: labels: app: navidrome spec: containers: - name: navidrome image: deluan/navidrome:latest # 官方镜像，国内可拉取 ports: - containerPort: 4533 # Navidrome默认端口 env: # 基础配置（可选，保持默认即可） - name: ND_LOGLEVEL value: "info" - name: ND_SESSIONTIMEOUT value: "24h" # 会话超时24小时 - name: ND_SCANSCHEDULE value: "1h" # 每1小时扫描一次音乐文件 # 挂载NFS PVC到容器内目录 volumeMounts: - name: music-volume mountPath: /music # 容器内音乐文件目录 - name: data-volume mountPath: /data # 容器内配置/数据库目录 # 资源限制（可选，防止占用过多资源） resources: requests: cpu: 100m memory: 128Mi limits: cpu: 500m memory: 512Mi # 关联PVC和容器卷 volumes: - name: music-volume persistentVolumeClaim: claimName: navidrome-music # 对应上面的音乐PVC - name: data-volume persistentVolumeClaim: claimName: navidrome-data # 对应上面的配置PVC --- # 4. Service - 暴露访问端口（NodePort） apiVersion: v1 kind: Service metadata: name: navidrome spec: type: NodePort # 暴露到节点端口，方便外部访问 selector: app: navidrome # 关联Navidrome Pod ports: - port: 4533 # Service端口 targetPort: 4533 # 容器端口 nodePort: 30453 # 节点端口（固定，可改，范围30000-32767）
```