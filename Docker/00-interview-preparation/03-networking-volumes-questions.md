# Docker Networking & Volumes Interview Questions

Questions about Docker networking modes, volume management, and data persistence.

---

## Table of Contents

- [Docker Networking](#docker-networking)
- [Network Types](#network-types)
- [Network Configuration](#network-configuration)
- [Docker Volumes](#docker-volumes)
- [Data Persistence](#data-persistence)
- [Storage Drivers](#storage-drivers)

---

## Docker Networking

### 1. What are Docker networking modes?

**Answer:**

Docker supports multiple network drivers for different use cases:

**Network Types:**

```
Docker Networks
├── Bridge (default)
├── Host
├── None
├── Overlay (Swarm)
├── Macvlan
└── Custom
```

**1. Bridge Network (Default):**

```bash
# Create bridge network
docker network create mybridge

# Run container on bridge
docker run --network mybridge nginx

# Characteristics:
# - Default network
# - Isolated from host
# - Containers can communicate via IP
# - Port mapping required for external access
```

**2. Host Network:**

```bash
# Use host network
docker run --network host nginx

# Characteristics:
# - Shares host's network stack
# - No network isolation
# - No port mapping needed
# - Better performance
# - Port conflicts possible
```

**3. None Network:**

```bash
# No networking
docker run --network none nginx

# Characteristics:
# - Complete network isolation
# - Only loopback interface
# - No external connectivity
# - Use for security/testing
```

**4. Overlay Network:**

```bash
# For Docker Swarm
docker network create --driver overlay myoverlay

# Characteristics:
# - Multi-host networking
# - Swarm/Kubernetes
# - Container communication across hosts
```

**Comparison Table:**

| Feature          | Bridge   | Host        | None     | Overlay    |
| ---------------- | -------- | ----------- | -------- | ---------- |
| **Isolation**    | Yes      | No          | Complete | Yes        |
| **Port Mapping** | Required | Not needed  | N/A      | Required   |
| **Performance**  | Good     | Best        | N/A      | Good       |
| **Use Case**     | Default  | Performance | Security | Multi-host |
| **DNS**          | Yes      | No          | No       | Yes        |

**Example:**

```bash
# Default bridge
docker run -d --name app1 nginx

# Custom bridge
docker network create mynet
docker run -d --name app2 --network mynet nginx

# Host network
docker run -d --name app3 --network host nginx

# None
docker run -d --name app4 --network none nginx
```

---

### 2. How do containers communicate with each other?

**Answer:**

**Same Network Communication:**

**1. Using Container Names (DNS):**

```bash
# Create network
docker network create myapp-network

# Run containers
docker run -d --name api --network myapp-network api:latest
docker run -d --name web --network myapp-network web:latest

# Inside web container:
curl http://api:3000  # Works! DNS resolves container name
```

**2. Using IP Addresses:**

```bash
# Get container IP
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' api

# Use IP (not recommended)
curl http://172.17.0.3:3000
```

**Complete Example:**

```yaml
# docker-compose.yml
version: "3.8"

services:
  database:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    networks:
      - backend

  api:
    build: ./api
    environment:
      # Use service name as hostname
      DB_HOST: database
      DB_PORT: 5432
    depends_on:
      - database
    networks:
      - backend
      - frontend

  web:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      # Use service name as hostname
      API_URL: http://api:3000
    depends_on:
      - api
    networks:
      - frontend

networks:
  backend:
  frontend:
```

**Communication Flow:**

```
web → api (via name "api" on frontend network)
api → database (via name "database" on backend network)
```

**Manual Docker Commands:**

```bash
# Create networks
docker network create frontend
docker network create backend

# Database (backend only)
docker run -d \
  --name database \
  --network backend \
  -e POSTGRES_PASSWORD=secret \
  postgres:15

# API (both networks)
docker run -d \
  --name api \
  --network backend \
  -e DB_HOST=database \
  api:latest

docker network connect frontend api

# Web (frontend only)
docker run -d \
  --name web \
  --network frontend \
  -p 3000:3000 \
  -e API_URL=http://api:3000 \
  web:latest
```

**Network Isolation:**

```
frontend network:
- web can reach api
- web CANNOT reach database

backend network:
- api can reach database
- database is isolated from web
```

**Test Connectivity:**

```bash
# From web container
docker exec web ping api        # Success
docker exec web ping database   # Fails (different network)

# From api container
docker exec api ping database   # Success
docker exec api ping web        # Success
```

---

### 3. What is the difference between bridge and host networking?

**Answer:**

| Aspect               | Bridge Network           | Host Network          |
| -------------------- | ------------------------ | --------------------- |
| **Network Stack**    | Isolated virtual network | Shares host's network |
| **Port Mapping**     | Required (-p flag)       | Not needed            |
| **Container Access** | localhost = container    | localhost = host      |
| **Performance**      | Slight overhead          | Best performance      |
| **Security**         | Better isolation         | Less isolation        |
| **Port Conflicts**   | Avoided                  | Possible              |
| **DNS**              | Built-in                 | No                    |
| **Default**          | Yes                      | No                    |

**Bridge Network Example:**

```bash
# Bridge (default)
docker run -d -p 8080:80 --name web-bridge nginx

# Access:
curl http://localhost:8080  # Works
curl http://localhost:80    # May not work (host's port 80)

# Container sees:
# - eth0: 172.17.0.2 (container IP)
# - Port 80 inside container
```

**Host Network Example:**

```bash
# Host network
docker run -d --network host --name web-host nginx

# Access:
curl http://localhost:80    # Works directly

# Container sees:
# - Host's network interfaces
# - No port mapping needed
# - Port 80 is on host
```

**Visual Comparison:**

```
BRIDGE MODE:
┌─────────────────────────────────────┐
│           Host (localhost)          │
│  ┌───────────────────────────────┐  │
│  │   Docker Bridge (172.17.0.1)  │  │
│  │  ┌────────────────────────┐   │  │
│  │  │  Container             │   │  │
│  │  │  IP: 172.17.0.2        │   │  │
│  │  │  Port: 80              │   │  │
│  │  └────────────────────────┘   │  │
│  └───────────────────────────────┘  │
│       ↑                              │
│       │ Port mapping: 8080:80        │
│       ↓                              │
│  localhost:8080 → container:80       │
└─────────────────────────────────────┘

HOST MODE:
┌─────────────────────────────────────┐
│           Host (localhost)          │
│  ┌────────────────────────────┐     │
│  │  Container                 │     │
│  │  Uses host's IP and ports  │     │
│  │  Port: 80 (host's port)    │     │
│  └────────────────────────────┘     │
│                                      │
│  localhost:80 → directly accessible  │
└─────────────────────────────────────┘
```

**When to Use:**

**Bridge (Default):**

- ✅ Most use cases
- ✅ Multiple containers on same port
- ✅ Better isolation
- ✅ Development environments
- ✅ Need DNS between containers

```bash
# Multiple containers on same port
docker run -d -p 8001:80 nginx
docker run -d -p 8002:80 nginx
docker run -d -p 8003:80 nginx
# All listen on port 80 inside, different ports outside
```

**Host Network:**

- ✅ Maximum performance needed
- ✅ Many ports to expose
- ✅ Network monitoring tools
- ✅ Direct host network access

```bash
# Performance-critical app
docker run --network host redis

# Network monitoring
docker run --network host nicolaka/netshoot
```

---

### 4. How do you create and manage Docker networks?

**Answer:**

**Create Networks:**

```bash
# Create bridge network (default)
docker network create mynetwork

# Create with specific driver
docker network create --driver bridge mybridge

# Create with subnet
docker network create \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  mynetwork

# Create overlay (for Swarm)
docker network create --driver overlay myoverlay

# With options
docker network create \
  --driver=bridge \
  --subnet=172.28.0.0/16 \
  --ip-range=172.28.5.0/24 \
  --gateway=172.28.5.254 \
  mynetwork
```

**List Networks:**

```bash
# List all networks
docker network ls

# Filter by driver
docker network ls --filter driver=bridge

# Format output
docker network ls --format "{{.Name}}: {{.Driver}}"
```

**Inspect Network:**

```bash
# Detailed info
docker network inspect mynetwork

# Get specific field
docker network inspect --format='{{range .Containers}}{{.Name}} {{end}}' mynetwork

# Multiple networks
docker network inspect mynetwork1 mynetwork2
```

**Connect/Disconnect Containers:**

```bash
# Connect container to network
docker network connect mynetwork mycontainer

# Connect with alias
docker network connect --alias db mynetwork postgres

# Connect with IP
docker network connect --ip 172.28.5.10 mynetwork mycontainer

# Disconnect
docker network disconnect mynetwork mycontainer

# Force disconnect
docker network disconnect -f mynetwork mycontainer
```

**Remove Networks:**

```bash
# Remove network
docker network rm mynetwork

# Remove multiple
docker network rm network1 network2 network3

# Remove unused networks
docker network prune

# Force removal
docker network prune -f
```

**Complete Example:**

```bash
# 1. Create networks
docker network create frontend
docker network create backend

# 2. Run database (backend only)
docker run -d \
  --name db \
  --network backend \
  postgres:15

# 3. Run API (both networks)
docker run -d \
  --name api \
  --network backend \
  myapi:latest

# Connect to frontend
docker network connect frontend api

# 4. Run web (frontend only)
docker run -d \
  --name web \
  --network frontend \
  -p 80:80 \
  myweb:latest

# 5. Verify connections
docker network inspect frontend
docker network inspect backend

# 6. Cleanup
docker stop web api db
docker rm web api db
docker network rm frontend backend
```

**Network with Docker Compose:**

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    networks:
      - backend

  api:
    image: myapi:latest
    networks:
      - frontend
      - backend

  web:
    image: myweb:latest
    networks:
      - frontend
    ports:
      - "80:80"

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

---

## Docker Volumes

### 5. What are Docker volumes and why use them?

**Answer:**

Docker volumes are the preferred way to persist data generated by and used by Docker containers.

**Why Use Volumes:**

1. **Persistence:** Data survives container deletion
2. **Sharing:** Share data between containers
3. **Performance:** Better than bind mounts
4. **Backup:** Easy backup and restore
5. **Platform Independent:** Works on all platforms
6. **Management:** Managed by Docker

**Volume Types:**

```
Docker Storage
├── Volumes (Managed by Docker) ✅
├── Bind Mounts (Host path)
└── tmpfs Mounts (Memory only)
```

**1. Named Volumes (Recommended):**

```bash
# Create volume
docker volume create mydata

# Use volume
docker run -v mydata:/app/data nginx

# Location: /var/lib/docker/volumes/mydata/_data
```

**2. Anonymous Volumes:**

```bash
# Docker creates and manages
docker run -v /app/data nginx

# Generated name like: 1234abc567def...
```

**3. Bind Mounts:**

```bash
# Mount host directory
docker run -v /host/path:/container/path nginx

# Current directory
docker run -v $(pwd):/app nginx
```

**4. tmpfs Mounts (Memory):**

```bash
# Store in memory only
docker run --tmpfs /app/cache nginx

# Not persisted
```

**Comparison:**

| Feature               | Volumes     | Bind Mounts | tmpfs      |
| --------------------- | ----------- | ----------- | ---------- |
| **Managed by Docker** | Yes         | No          | No         |
| **Location**          | Docker area | Anywhere    | Memory     |
| **Performance**       | Best        | Good        | Fastest    |
| **Persistence**       | Yes         | Yes         | No         |
| **Platform**          | All         | All         | Linux only |
| **Backup**            | Easy        | Manual      | N/A        |

**Complete Example:**

```bash
# 1. Create volume
docker volume create postgres-data

# 2. Run database with volume
docker run -d \
  --name db \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:15

# 3. Data persists
docker stop db
docker rm db

# 4. Data still exists
docker volume ls  # postgres-data exists

# 5. Reuse data
docker run -d \
  --name db \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:15

# Data restored!
```

**Docker Compose Example:**

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    volumes:
      # Named volume
      - postgres-data:/var/lib/postgresql/data
      # Bind mount
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      # Anonymous volume
      - /var/lib/postgresql
    environment:
      POSTGRES_PASSWORD: secret

  web:
    image: nginx:latest
    volumes:
      # Bind mount for development
      - ./html:/usr/share/nginx/html:ro
      # Named volume for logs
      - nginx-logs:/var/log/nginx

volumes:
  postgres-data:
  nginx-logs:
```

---

### 6. What is the difference between volumes and bind mounts?

**Answer:**

| Aspect          | Volumes                  | Bind Mounts        |
| --------------- | ------------------------ | ------------------ |
| **Management**  | Docker manages           | User manages       |
| **Location**    | /var/lib/docker/volumes/ | Any host path      |
| **Creation**    | Explicit or automatic    | Must exist on host |
| **Portability** | Highly portable          | Platform specific  |
| **Performance** | Optimized by Docker      | Depends on host FS |
| **Backup**      | Easy with Docker         | Manual             |
| **Access**      | Through Docker           | Direct file access |
| **Security**    | More isolated            | Less isolated      |
| **Use Case**    | Production               | Development        |

**Volumes Example:**

```bash
# Create volume
docker volume create mydata

# Use volume
docker run -d \
  --name app \
  -v mydata:/app/data \
  nginx

# List volumes
docker volume ls

# Inspect
docker volume inspect mydata

# Location (don't access directly)
# /var/lib/docker/volumes/mydata/_data

# Backup volume
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  ubuntu tar czf /backup/mydata.tar.gz /data

# Restore volume
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  ubuntu tar xzf /backup/mydata.tar.gz -C /data --strip 1
```

**Bind Mounts Example:**

```bash
# Mount current directory
docker run -d \
  --name app \
  -v $(pwd)/app:/usr/share/nginx/html \
  nginx

# Mount specific path
docker run -d \
  --name app \
  -v /home/user/project:/app \
  nginx

# Read-only mount
docker run -d \
  --name app \
  -v $(pwd)/config:/app/config:ro \
  nginx

# Access directly on host
cd /home/user/project
ls -la  # See files directly
```

**When to Use:**

**Volumes (Production):**

```yaml
# docker-compose.yml (Production)
version: "3.8"

services:
  db:
    image: postgres:15
    volumes:
      # ✅ Volume for data persistence
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret

volumes:
  postgres-data:
    driver: local
```

**Bind Mounts (Development):**

```yaml
# docker-compose.yml (Development)
version: "3.8"

services:
  web:
    image: node:18
    volumes:
      # ✅ Bind mount for live reload
      - ./src:/app/src
      - ./package.json:/app/package.json
      # ✅ Volume for node_modules
      - node_modules:/app/node_modules
    command: npm run dev

volumes:
  node_modules:
```

**Best Practices:**

**Use Volumes for:**

- Database data
- Production environments
- Sharing between containers
- Docker-managed backup
- Long-term storage

**Use Bind Mounts for:**

- Development (hot reload)
- Configuration files
- Source code editing
- Logs (for viewing)
- Direct file access needed

**Real-world Example:**

```yaml
version: "3.8"

services:
  # Production database - Use volume
  db:
    image: postgres:15
    volumes:
      - db-data:/var/lib/postgresql/data # Volume
    environment:
      POSTGRES_PASSWORD: secret

  # Development API - Use bind mount
  api:
    build: ./api
    volumes:
      - ./api/src:/app/src:ro # Bind (development)
      - api-logs:/app/logs # Volume (logs)
    environment:
      DB_HOST: db
    depends_on:
      - db

  # Production web - Use volume
  web:
    image: nginx:latest
    volumes:
      - web-content:/usr/share/nginx/html # Volume
      - ./nginx.conf:/etc/nginx/nginx.conf:ro # Bind (config)
    ports:
      - "80:80"

volumes:
  db-data: # Managed by Docker
  api-logs: # Managed by Docker
  web-content: # Managed by Docker
```

---

### 7. How do you manage Docker volumes?

**Answer:**

**Create Volumes:**

```bash
# Basic creation
docker volume create myvolume

# With driver
docker volume create --driver local myvolume

# With options
docker volume create \
  --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.1,rw \
  --opt device=:/path/to/dir \
  nfs-volume

# With labels
docker volume create \
  --label env=production \
  --label app=database \
  prod-data
```

**List Volumes:**

```bash
# List all volumes
docker volume ls

# Filter by name
docker volume ls --filter name=prod

# Filter by dangling
docker volume ls --filter dangling=true

# Filter by label
docker volume ls --filter label=env=production

# Format output
docker volume ls --format "{{.Name}}: {{.Driver}}"
```

**Inspect Volumes:**

```bash
# Inspect volume
docker volume inspect myvolume

# Get mount point
docker volume inspect --format '{{.Mountpoint}}' myvolume

# Check multiple volumes
docker volume inspect vol1 vol2 vol3

# Pretty print
docker volume inspect myvolume | jq
```

**Use Volumes:**

```bash
# Run with volume
docker run -v myvolume:/data nginx

# Read-only volume
docker run -v myvolume:/data:ro nginx

# Multiple volumes
docker run \
  -v data:/app/data \
  -v config:/app/config \
  -v logs:/app/logs \
  myapp

# Volume from another container
docker run --volumes-from container1 nginx
```

**Backup Volumes:**

```bash
# Backup volume to tar
docker run --rm \
  -v myvolume:/data \
  -v $(pwd):/backup \
  ubuntu \
  tar czf /backup/myvolume-backup.tar.gz -C /data .

# Backup with date
docker run --rm \
  -v myvolume:/data \
  -v $(pwd):/backup \
  ubuntu \
  tar czf /backup/backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

**Restore Volumes:**

```bash
# Create new volume
docker volume create myvolume-restored

# Restore from tar
docker run --rm \
  -v myvolume-restored:/data \
  -v $(pwd):/backup \
  ubuntu \
  tar xzf /backup/myvolume-backup.tar.gz -C /data
```

**Copy Between Volumes:**

```bash
# Copy from volume1 to volume2
docker run --rm \
  -v volume1:/source \
  -v volume2:/dest \
  ubuntu \
  cp -av /source/. /dest/
```

**Remove Volumes:**

```bash
# Remove volume
docker volume rm myvolume

# Remove multiple
docker volume rm vol1 vol2 vol3

# Remove unused volumes
docker volume prune

# Force removal
docker volume prune -f

# Remove volumes of specific label
docker volume prune --filter label=env=dev
```

**Volume Operations in Docker Compose:**

```yaml
version: "3.8"

services:
  app:
    image: myapp
    volumes:
      # Named volume
      - app-data:/app/data

      # External volume
      - external-data:/app/external

      # Volume with driver options
      - nfs-data:/app/nfs

volumes:
  app-data:
    driver: local

  external-data:
    external: true
    name: real-volume-name

  nfs-data:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.1.1,rw
      device: ":/path/to/dir"
```

**Useful Commands:**

```bash
# Show disk usage
docker system df -v

# Find volume location
docker volume inspect myvolume --format '{{.Mountpoint}}'

# List containers using volume
docker ps -a --filter volume=myvolume

# Check volume size
sudo du -sh /var/lib/docker/volumes/myvolume

# Create volume from container
docker run -v myvolume:/data alpine

# Export volume data
docker run --rm -v myvolume:/data alpine tar c /data

# Import volume data
docker run --rm -v myvolume:/data alpine sh -c 'tar x -C /data'
```

---

## Data Persistence

### 8. How do you persist data in Docker?

**Answer:**

**Methods of Data Persistence:**

**1. Named Volumes (Recommended):**

```bash
# Create volume
docker volume create postgres-data

# Use in container
docker run -d \
  --name db \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15

# Data persists even after container removal
docker rm -f db
docker volume ls  # postgres-data still exists
```

**2. Bind Mounts:**

```bash
# Mount host directory
docker run -d \
  --name db \
  -v /host/data:/var/lib/postgresql/data \
  postgres:15

# Data stored in /host/data on host machine
```

**3. Docker Compose with Volumes:**

```yaml
version: "3.8"

services:
  database:
    image: postgres:15
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret

  redis:
    image: redis:latest
    volumes:
      - redis-data:/data

  app:
    build: .
    volumes:
      - app-uploads:/app/uploads
      - app-logs:/app/logs

volumes:
  db-data:
  redis-data:
  app-uploads:
  app-logs:
```

**Complete Persistence Example:**

```yaml
# docker-compose.yml
version: "3.8"

services:
  # PostgreSQL with persistence
  postgres:
    image: postgres:15
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret

  # MongoDB with persistence
  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
      - mongo-config:/data/configdb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret

  # Redis with persistence
  redis:
    image: redis:latest
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data

  # Application with file uploads
  app:
    build: ./app
    volumes:
      # User uploads
      - user-uploads:/app/uploads
      # Application logs
      - app-logs:/app/logs
      # Temporary files (not persisted)
      - /app/temp
    depends_on:
      - postgres
      - mongo
      - redis

  # Nginx with SSL certificates
  nginx:
    image: nginx:latest
    volumes:
      # Static content
      - static-files:/usr/share/nginx/html
      # SSL certificates (bind mount for security)
      - ./certs:/etc/nginx/certs:ro
      # Config (bind mount for easy updates)
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      # Logs
      - nginx-logs:/var/log/nginx
    ports:
      - "80:80"
      - "443:443"

volumes:
  # Database volumes
  postgres-data:
    driver: local
  mongo-data:
    driver: local
  mongo-config:
    driver: local
  redis-data:
    driver: local

  # Application volumes
  user-uploads:
    driver: local
  app-logs:
    driver: local
  static-files:
    driver: local
  nginx-logs:
    driver: local
```

**Backup Strategy:**

```bash
#!/bin/bash
# backup-volumes.sh

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="./backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker run --rm \
  -v postgres-data:/data \
  -v $BACKUP_DIR:/backup \
  ubuntu \
  tar czf /backup/postgres-$DATE.tar.gz -C /data .

# Backup MongoDB
docker run --rm \
  -v mongo-data:/data \
  -v $BACKUP_DIR:/backup \
  ubuntu \
  tar czf /backup/mongo-$DATE.tar.gz -C /data .

# Backup Redis
docker run --rm \
  -v redis-data:/data \
  -v $BACKUP_DIR:/backup \
  ubuntu \
  tar czf /backup/redis-$DATE.tar.gz -C /data .

# Backup user uploads
docker run --rm \
  -v user-uploads:/data \
  -v $BACKUP_DIR:/backup \
  ubuntu \
  tar czf /backup/uploads-$DATE.tar.gz -C /data .

echo "Backups completed: $DATE"
```

**Restore Strategy:**

```bash
#!/bin/bash
# restore-volumes.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore-volumes.sh <backup-file>"
  exit 1
fi

VOLUME_NAME=$(basename $BACKUP_FILE .tar.gz | cut -d'-' -f1)

# Stop containers using the volume
docker-compose stop

# Create new volume if not exists
docker volume create ${VOLUME_NAME}-data

# Restore data
docker run --rm \
  -v ${VOLUME_NAME}-data:/data \
  -v $(pwd)/backups:/backup \
  ubuntu \
  tar xzf /backup/$BACKUP_FILE -C /data

# Start containers
docker-compose up -d

echo "Restore completed: $VOLUME_NAME"
```

**Best Practices:**

1. Use named volumes for databases
2. Regular backups
3. Test restore procedures
4. Use volume drivers for production
5. Monitor disk usage
6. Label volumes appropriately
7. Document volume purposes
8. Use external volumes for critical data

---

## Storage Drivers

### 9. What are Docker storage drivers?

**Answer:**

Storage drivers control how images and containers are stored and managed on Docker host.

**Common Storage Drivers:**

```
Storage Drivers
├── overlay2 (default, recommended)
├── aufs (legacy)
├── devicemapper
├── btrfs
├── zfs
└── vfs (no copy-on-write)
```

**1. overlay2 (Recommended):**

```bash
# Default on most systems
# Fast, efficient
# Requires Linux kernel 4.0+

# Check current driver
docker info | grep "Storage Driver"
```

**2. Configuration:**

```json
// /etc/docker/daemon.json
{
  "storage-driver": "overlay2",
  "storage-opts": ["overlay2.override_kernel_check=true"]
}
```

**Comparison:**

| Driver           | Speed  | Stability | Use Case       |
| ---------------- | ------ | --------- | -------------- |
| **overlay2**     | Fast   | Stable    | Default choice |
| **aufs**         | Good   | Stable    | Legacy systems |
| **devicemapper** | Medium | Good      | RHEL/CentOS 7  |
| **btrfs**        | Good   | Good      | Advanced FS    |
| **zfs**          | Good   | Good      | Advanced FS    |
| **vfs**          | Slow   | Stable    | Testing only   |

**Check Storage Driver:**

```bash
# View current driver
docker info | grep Storage

# Detailed info
docker info --format '{{json .Driver}}' | jq

# System info
docker system info
```

**Storage Driver Features:**

**overlay2:**

- ✅ Production-ready
- ✅ Good performance
- ✅ Efficient use of disk
- ✅ Default on modern Linux
- Copy-on-write enabled

**aufs:**

- Legacy driver
- Good for many layers
- Ubuntu < 18.04

**devicemapper:**

- Used on older RHEL/CentOS
- Requires configuration
- Direct-lvm for production

**Change Storage Driver:**

```bash
# 1. Stop Docker
sudo systemctl stop docker

# 2. Configure
sudo nano /etc/docker/daemon.json
{
  "storage-driver": "overlay2"
}

# 3. Remove old data (optional, careful!)
sudo rm -rf /var/lib/docker

# 4. Start Docker
sudo systemctl start docker

# 5. Verify
docker info | grep "Storage Driver"
```

**Storage Driver Impact:**

```bash
# Check disk usage
docker system df

# Detailed view
docker system df -v

# Per storage layer
du -sh /var/lib/docker/overlay2/*
```

---

### 10. How do you handle storage in Docker production?

**Answer:**

**Production Storage Strategy:**

**1. Use Volume Drivers:**

```yaml
# docker-compose.yml
version: "3.8"

services:
  db:
    image: postgres:15
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/fast-ssd/postgres-data
```

**2. External Storage:**

```yaml
volumes:
  db-data:
    external: true
    name: production-postgres-data
```

**3. NFS Volumes:**

```yaml
volumes:
  shared-data:
    driver: local
    driver_opts:
      type: nfs
      o: addr=nfs-server.com,rw
      device: ":/path/to/shared"
```

**4. Cloud Storage (AWS EFS):**

```yaml
volumes:
  app-data:
    driver: local
    driver_opts:
      type: nfs4
      o: addr=fs-123456.efs.us-east-1.amazonaws.com,rw
      device: ":/"
```

**Complete Production Example:**

```yaml
version: "3.8"

services:
  # Database - Fast SSD
  postgres:
    image: postgres:15
    volumes:
      - postgres-data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 4G

  # Application - Standard storage
  app:
    image: myapp:latest
    volumes:
      # Logs - Local volume
      - app-logs:/app/logs

      # Uploads - Shared NFS
      - shared-uploads:/app/uploads

      # Cache - tmpfs (memory)
      - type: tmpfs
        target: /app/cache
        tmpfs:
          size: 1G

  # Backup service
  backup:
    image: backup-service
    volumes:
      # Access all data volumes
      - postgres-data:/backup/postgres:ro
      - shared-uploads:/backup/uploads:ro
      # Backup destination
      - backup-storage:/backups
    environment:
      BACKUP_SCHEDULE: "0 2 * * *"

volumes:
  # Critical data - SSD backed
  postgres-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/ssd/postgres

  # Shared storage - NFS
  shared-uploads:
    driver: local
    driver_opts:
      type: nfs
      o: addr=nfs.example.com,rw,nolock
      device: ":/shared/uploads"

  # Backup storage - S3 backed
  backup-storage:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/s3-backup

  # Local logs
  app-logs:
    driver: local
```

**Monitoring and Maintenance:**

```bash
# Check disk usage
docker system df -v

# Monitor specific volumes
watch -n 5 'docker system df'

# Alert on disk usage
#!/bin/bash
USAGE=$(docker system df --format "{{.Size}}" | head -1)
if [ "$USAGE" -gt "80%" ]; then
  echo "Alert: Docker disk usage above 80%"
fi

# Cleanup old data
docker volume prune -f
docker image prune -a -f
docker system prune -a -f --volumes
```

**Best Practices:**

1. Separate data and OS disks
2. Use appropriate storage drivers
3. Regular backups
4. Monitor disk usage
5. Use volume labels
6. Document volume purposes
7. Test disaster recovery
8. Use external volumes for critical data
9. Implement retention policies
10. Use appropriate I/O performance storage

---

**Continue to:** [04. Docker Compose Questions →](04-compose-questions.md)

**Return to:** [Interview Preparation Index →](README.md)
