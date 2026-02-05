
下载镜像

```
docker pull adguard/adguardhome
```

创建并启动容器

```
docker run -d --name adguardhome -v /opt/adguardhome/work:/opt/adguardhome/work -v /opt/adguardhome/conf:/opt/adguardhome/conf -p 10053:53/tcp -p 10053:53/udp -p 3000:3000 adguard/adguardhome
```

访问网页：localhost:3000
![[Pasted image 20251014164415.png]]


如图配置，主要是网页管理端口改成3000
![[Pasted image 20251014164444.png]]

配置密码
![[Pasted image 20251014164518.png]]
















