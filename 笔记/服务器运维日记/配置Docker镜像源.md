```
vi /etc/docker/daemon.json
```

```
{
        "registry-mirrors":
                [
                        "https://docker.1ms.run",
                        "https://docker-0.unsee.tech",
                        "https://docker.m.daocloud.io"
                ],
        "live-restore": true, "features": {
                        "buildkit": true
                }
}

```

```
systemctl daemon-reload 
systemctl restart docker
```