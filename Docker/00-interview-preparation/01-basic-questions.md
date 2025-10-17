# Docker Basic Interview Questions

Comprehensive collection of basic Docker interview questions with detailed answers.

---

## Table of Contents
- [Fundamentals](#fundamentals)
- [Docker Architecture](#docker-architecture)
- [Containers vs VMs](#containers-vs-vms)
- [Basic Commands](#basic-commands)
- [Images and Containers](#images-and-containers)
- [Installation and Setup](#installation-and-setup)

---

## Fundamentals

### 1. What is Docker?

**Answer:**

Docker is an open-source platform for developing, shipping, and running applications in containers. It provides:

**Key Features:**
- **Containerization:** Package applications with their dependencies
- **Portability:** Run anywhere - laptop, server, cloud
- **Isolation:** Separate applications and their environments
- **Efficiency:** Share OS kernel, lightweight compared to VMs
- **Consistency:** Same environment from development to production

**Core Components:**
```
Docker Platform
├── Docker Engine (runtime)
├── Docker Hub (registry)
├── Docker Compose (orchestration)
└── Docker CLI (command-line interface)
```

**Benefits:**
- Faster deployment
- Easier scaling
- Better resource utilization
- Simplified dependency management
- Consistent environments

---

### 2. What is a Container?

**Answer:**

A container is a lightweight, standalone, executable package that includes everything needed to run an application:

**Contents of a Container:**
- Application code
- Runtime
- System tools
- System libraries
- Settings

**Characteristics:**
- **Isolated:** Own filesystem, processes, network
- **Portable:** Runs consistently across environments
- **Lightweight:** Shares host OS kernel
- **Fast:** Starts in seconds
- **Ephemeral:** Typically stateless and replaceable

**Example:**
```bash
# Container contains everything needed
Container
├── Application Code
├── Node.js Runtime
├── npm Dependencies
├── Configuration Files
└── Environment Variables
```

**Real-world Analogy:**
Think of containers like shipping containers:
- Standardized format
- Can be moved easily
- Contains everything inside
- Works anywhere
- Can be stacked and organized

---

### 3. What is the difference between Docker Image and Docker Container?

**Answer:**

| Aspect | Docker Image | Docker Container |
|--------|-------------|------------------|
| **Definition** | Blueprint/template | Running instance |
| **State** | Immutable (read-only) | Mutable (read-write) |
| **Storage** | Stored in registry | Runs in memory |
| **Purpose** | Define what to run | Actually runs application |
| **Creation** | Built from Dockerfile | Created from image |
| **Lifespan** | Permanent until deleted | Temporary, can be stopped |
| **Layers** | Multiple read-only layers | Image layers + writable layer |

**Analogy:**
```
Class (Image) vs Object (Container)

Image:
- Like a recipe
- Template to create containers
- One image → many containers

Container:
- Like a cake made from recipe
- Running instance
- Can have multiple from one image
```

**Example:**
```bash
# Image - template
docker build -t myapp:1.0 .

# Container - running instance
docker run myapp:1.0  # Creates container 1
docker run myapp:1.0  # Creates container 2
# Both containers from same image
```

---

### 4. What is Docker Hub?

**Answer:**

Docker Hub is a cloud-based registry service for storing and sharing Docker images.

**Key Features:**

1. **Public Registry:**
   - Free public repositories
   - Access to official images
   - Community contributions

2. **Private Repositories:**
   - Secure private images
   - Access control
   - Team collaboration

3. **Official Images:**
   - Curated by Docker
   - Trusted sources
   - Well-maintained

4. **Automated Builds:**
   - Link to GitHub/Bitbucket
   - Auto-build on commit
   - CI/CD integration

**Common Operations:**
```bash
# Search for images
docker search nginx

# Pull an image
docker pull nginx:latest

# Push your image
docker login
docker tag myapp:1.0 username/myapp:1.0
docker push username/myapp:1.0

# Access official images
docker pull node:18
docker pull postgres:15
docker pull redis:latest
```

**Alternatives:**
- Amazon ECR
- Google Container Registry
- Azure Container Registry
- GitLab Container Registry
- Private registries

---

## Docker Architecture

### 5. Explain Docker Architecture

**Answer:**

Docker uses a client-server architecture with the following components:

**Architecture Diagram:**
```
┌─────────────────────────────────────────────┐
│           Docker Architecture                │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐       ┌─────────────────┐│
│  │ Docker Client│◄─────►│  Docker Daemon  ││
│  │   (CLI)      │ REST  │   (dockerd)     ││
│  └──────────────┘  API  └─────────────────┘│
│         │                       │           │
│         │                       ▼           │
│         │              ┌─────────────────┐ │
│         │              │   Images        │ │
│         │              │   Containers    │ │
│         │              │   Networks      │ │
│         │              │   Volumes       │ │
│         │              └─────────────────┘ │
│         │                                   │
│         ▼                                   │
│  ┌──────────────┐                          │
│  │Docker Registry│                          │
│  │ (Docker Hub) │                          │
│  └──────────────┘                          │
└─────────────────────────────────────────────┘
```

**Components:**

1. **Docker Client:**
   - Command-line interface (CLI)
   - User interaction point
   - Sends commands to daemon
   - `docker run`, `docker build`, etc.

2. **Docker Daemon (dockerd):**
   - Background service
   - Manages Docker objects
   - Listens to Docker API
   - Handles images, containers, networks, volumes

3. **Docker Registry:**
   - Stores Docker images
   - Public (Docker Hub) or private
   - Pull and push images

4. **Docker Objects:**
   - **Images:** Read-only templates
   - **Containers:** Runnable instances
   - **Networks:** Connect containers
   - **Volumes:** Persistent storage

**Communication Flow:**
```bash
1. User: docker run nginx
2. Client → Daemon: API request
3. Daemon: Check local images
4. Daemon → Registry: Pull image (if needed)
5. Daemon: Create container
6. Daemon: Start container
7. Client ← Daemon: Status response
```

---

### 6. What is Docker Engine?

**Answer:**

Docker Engine is the core component that enables containerization. It consists of:

**Components:**

```
Docker Engine
├── Docker Daemon (dockerd)
│   ├── API Server
│   ├── Container Runtime
│   └── Image Management
├── REST API
│   └── Interface for interaction
└── Docker CLI (docker)
    └── Command-line client
```

**Layers:**

1. **dockerd (Daemon):**
   - Server component
   - Long-running process
   - Manages containers

2. **containerd:**
   - Container runtime
   - Manages container lifecycle
   - Industry standard (CNCF project)

3. **runc:**
   - Low-level runtime
   - Creates and runs containers
   - OCI compliant

**Process Flow:**
```
Docker CLI
    ↓
Docker API
    ↓
dockerd (daemon)
    ↓
containerd (runtime)
    ↓
runc (container creation)
    ↓
Linux Kernel (namespaces, cgroups)
```

**Features:**
- Image management
- Container lifecycle
- Network management
- Volume management
- Resource allocation
- Security isolation

---

## Containers vs VMs

### 7. What is the difference between Containers and Virtual Machines?

**Answer:**

| Aspect | Containers | Virtual Machines |
|--------|-----------|------------------|
| **Architecture** | Share host OS kernel | Each has full OS |
| **Size** | Lightweight (MBs) | Heavy (GBs) |
| **Startup** | Seconds | Minutes |
| **Isolation** | Process-level | Hardware-level |
| **Resources** | Efficient, shared | Dedicated resources |
| **Portability** | Highly portable | Less portable |
| **Performance** | Near-native | Overhead from virtualization |
| **OS Support** | Same OS as host | Any OS |

**Visual Comparison:**

```
Virtual Machines:
┌─────────────────────────────────┐
│      Host Operating System       │
├─────────────────────────────────┤
│         Hypervisor (ESXi)       │
├──────────┬──────────┬──────────┤
│  VM 1    │   VM 2   │   VM 3   │
│┌────────┐│┌────────┐│┌────────┐│
││Guest OS│││Guest OS│││Guest OS││
││(Linux) │││(Windows│││(Linux) ││
│├────────┤││        ││├────────┤│
││Bins/Libs│││Bins/Libs│││Bins/Libs││
│├────────┤│├────────┤│├────────┤│
││App A   ││││App B   ││││App C   ││
│└────────┘│└────────┘│└────────┘│
└──────────┴──────────┴──────────┘

Containers:
┌─────────────────────────────────┐
│      Host Operating System       │
├─────────────────────────────────┤
│         Docker Engine           │
├──────────┬──────────┬──────────┤
│Container1│Container2│Container3│
│┌────────┐│┌────────┐│┌────────┐│
││Bins/Libs│││Bins/Libs│││Bins/Libs││
│├────────┤│├────────┤│├────────┤│
││App A   ││││App B   ││││App C   ││
│└────────┘│└────────┘│└────────┘│
└──────────┴──────────┴──────────┘
```

**When to Use:**

**Containers:**
- Microservices
- CI/CD pipelines
- Rapid deployment
- Consistent environments
- Resource efficiency

**Virtual Machines:**
- Running different OS
- Strong isolation needed
- Legacy applications
- Full OS features required
- Security-critical workloads

**Combination Approach:**
Many organizations use both:
- VMs for infrastructure isolation
- Containers for application deployment

---

### 8. Why use Docker over Virtual Machines?

**Answer:**

**Advantages of Docker:**

1. **Resource Efficiency:**
```
VM: 1GB+ per instance
Container: 10-100MB per instance
```

2. **Speed:**
```
VM Boot Time: 30-60 seconds
Container Start: <1 second
```

3. **Density:**
```
Server with 16GB RAM:
- VMs: 4-8 instances
- Containers: 50-100 instances
```

4. **Portability:**
```bash
# Same container everywhere
laptop → staging → production
```

5. **Cost:**
- Less hardware needed
- Lower cloud costs
- Reduced licensing fees

**Practical Example:**

```bash
# Development workflow

With VMs:
- Create VM: 30 minutes
- Install OS: 15 minutes
- Configure environment: 30 minutes
- Total: 75 minutes

With Docker:
- docker run myapp: 5 seconds
- Environment ready: immediate
- Total: 5 seconds
```

**Use Cases Where Docker Excels:**
- Microservices architecture
- Continuous Integration/Deployment
- Development environments
- Application scaling
- Testing multiple configurations

---

## Basic Commands

### 9. What are the essential Docker commands?

**Answer:**

**Container Management:**
```bash
# Run container
docker run [OPTIONS] IMAGE [COMMAND]
docker run -d -p 80:80 nginx
docker run -it ubuntu bash

# List containers
docker ps              # Running containers
docker ps -a           # All containers

# Start/Stop containers
docker start CONTAINER
docker stop CONTAINER
docker restart CONTAINER

# Remove container
docker rm CONTAINER
docker rm -f CONTAINER  # Force remove
```

**Image Management:**
```bash
# List images
docker images
docker image ls

# Pull image
docker pull IMAGE:TAG
docker pull node:18

# Build image
docker build -t NAME:TAG .
docker build -t myapp:1.0 .

# Remove image
docker rmi IMAGE
docker image rm IMAGE

# Tag image
docker tag SOURCE_IMAGE TARGET_IMAGE
```

**Information & Inspection:**
```bash
# View logs
docker logs CONTAINER
docker logs -f CONTAINER  # Follow

# Inspect container
docker inspect CONTAINER

# View processes
docker top CONTAINER

# View stats
docker stats CONTAINER

# Execute command in container
docker exec -it CONTAINER bash
```

**Cleanup:**
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused data
docker system prune

# Remove everything (careful!)
docker system prune -a --volumes
```

---

### 10. Explain `docker run` command with options

**Answer:**

The `docker run` command creates and starts a container from an image.

**Basic Syntax:**
```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARGS]
```

**Common Options:**

1. **Detached Mode:**
```bash
docker run -d nginx
# Runs in background
```

2. **Interactive Mode:**
```bash
docker run -it ubuntu bash
# -i: interactive
# -t: terminal
```

3. **Port Mapping:**
```bash
docker run -p 8080:80 nginx
# Host:Container
# Access via localhost:8080
```

4. **Name Container:**
```bash
docker run --name mycontainer nginx
```

5. **Environment Variables:**
```bash
docker run -e NODE_ENV=production app
docker run -e DB_HOST=localhost -e DB_PORT=5432 app
```

6. **Volume Mounting:**
```bash
docker run -v /host/path:/container/path nginx
docker run -v myvolume:/data nginx
```

7. **Network:**
```bash
docker run --network mynetwork nginx
```

8. **Resource Limits:**
```bash
docker run --memory="512m" --cpus="1.5" nginx
```

9. **Auto-remove:**
```bash
docker run --rm nginx
# Automatically removes container when stopped
```

10. **Restart Policy:**
```bash
docker run --restart unless-stopped nginx
docker run --restart always nginx
```

**Complete Example:**
```bash
docker run -d \
  --name my-web-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=db.example.com \
  -v /app/data:/data \
  --network app-network \
  --memory="1g" \
  --cpus="2" \
  --restart unless-stopped \
  myapp:1.0
```

**Explanation:**
- `-d`: Run in background
- `--name`: Container name
- `-p`: Map port 3000
- `-e`: Set environment variables
- `-v`: Mount volume
- `--network`: Connect to network
- `--memory`: Limit RAM to 1GB
- `--cpus`: Limit to 2 CPUs
- `--restart`: Restart policy
- `myapp:1.0`: Image to use

---

## Images and Containers

### 11. How do you create a Docker image?

**Answer:**

**Method 1: Using Dockerfile (Recommended)**

1. **Create Dockerfile:**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

2. **Build Image:**
```bash
docker build -t myapp:1.0 .

# With custom Dockerfile name
docker build -f Dockerfile.prod -t myapp:1.0 .

# No cache
docker build --no-cache -t myapp:1.0 .
```

**Method 2: From Container (Not Recommended)**
```bash
# Run container
docker run -it ubuntu bash

# Make changes inside container
apt-get update && apt-get install -y curl

# Commit changes to new image
docker commit CONTAINER_ID myimage:1.0
```

**Method 3: Import from Tar**
```bash
# Export container
docker export CONTAINER > myimage.tar

# Import as image
docker import myimage.tar myimage:1.0
```

**Best Practices:**
- Use Dockerfile for reproducibility
- Multi-stage builds for optimization
- Minimize layers
- Use specific tags
- Don't include secrets
- Use .dockerignore

**Example .dockerignore:**
```
node_modules
npm-debug.log
.git
.env
*.md
```

---

### 12. What is a Dockerfile?

**Answer:**

A Dockerfile is a text file containing instructions to build a Docker image.

**Common Instructions:**

```dockerfile
# 1. FROM - Base image
FROM node:18-alpine

# 2. LABEL - Metadata
LABEL maintainer="dev@example.com"
LABEL version="1.0"

# 3. WORKDIR - Set working directory
WORKDIR /app

# 4. COPY - Copy files
COPY package.json .
COPY src ./src

# 5. ADD - Copy with extraction
ADD app.tar.gz /app

# 6. RUN - Execute commands
RUN npm install
RUN apt-get update && apt-get install -y curl

# 7. ENV - Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# 8. EXPOSE - Document ports
EXPOSE 3000

# 9. VOLUME - Mount points
VOLUME ["/data"]

# 10. USER - Set user
USER node

# 11. CMD - Default command
CMD ["node", "server.js"]

# 12. ENTRYPOINT - Fixed command
ENTRYPOINT ["node"]
CMD ["server.js"]
```

**Complete Example:**
```dockerfile
# Multi-stage build
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js

CMD ["node", "server.js"]
```

**Best Practices:**
- Order instructions by change frequency
- Combine RUN commands
- Use specific versions
- Minimize image size
- Multi-stage builds
- Don't run as root
- Use COPY over ADD
- Include health checks

---

### 13. Difference between CMD and ENTRYPOINT?

**Answer:**

| Aspect | CMD | ENTRYPOINT |
|--------|-----|------------|
| **Purpose** | Default command | Fixed command |
| **Override** | Easily overridden | Requires --entrypoint |
| **Usage** | Provide defaults | Define main executable |
| **Arguments** | Can be replaced | Can be appended |

**CMD Examples:**
```dockerfile
# Shell form
CMD node server.js

# Exec form (preferred)
CMD ["node", "server.js"]

# As default parameters for ENTRYPOINT
CMD ["--help"]
```

**Running:**
```bash
# Uses CMD
docker run myapp

# Overrides CMD
docker run myapp echo "Hello"
```

**ENTRYPOINT Examples:**
```dockerfile
# Exec form
ENTRYPOINT ["node"]

# With CMD
ENTRYPOINT ["node"]
CMD ["server.js"]
```

**Running:**
```bash
# Runs: node server.js
docker run myapp

# Runs: node app.js
docker run myapp app.js

# Override ENTRYPOINT
docker run --entrypoint bash myapp
```

**Combined Usage (Best Practice):**
```dockerfile
# Fixed executable
ENTRYPOINT ["node"]

# Default argument
CMD ["server.js"]
```

**Running:**
```bash
# node server.js
docker run myapp

# node debug.js
docker run myapp debug.js
```

**Real-world Example:**
```dockerfile
# Database container
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres"]

# Web server
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Application
ENTRYPOINT ["python"]
CMD ["app.py"]
```

**When to Use:**
- **CMD:** Provide default command that can be overridden
- **ENTRYPOINT:** Container as executable
- **Both:** ENTRYPOINT for executable, CMD for default args

---

## Installation and Setup

### 14. How do you install Docker?

**Answer:**

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Add user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker run hello-world
```

**macOS:**
```bash
# Using Homebrew
brew install --cask docker

# Or download Docker Desktop from:
# https://www.docker.com/products/docker-desktop

# Verify
docker --version
```

**Windows:**
```bash
# Download Docker Desktop from:
# https://www.docker.com/products/docker-desktop

# Enable WSL 2
wsl --install

# Install Docker Desktop
# Run installer and follow prompts

# Verify in PowerShell
docker --version
```

**Post-Installation:**
```bash
# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Test Docker
docker run hello-world

# Check Docker info
docker info

# Verify Docker Compose
docker compose version
```

---

### 15. How do you check Docker installation?

**Answer:**

**Version Check:**
```bash
# Docker version
docker --version
docker version  # Detailed

# Docker Compose version
docker compose version

# Expected output:
# Docker version 24.0.x, build xxxxx
```

**Docker Info:**
```bash
docker info

# Shows:
# - Server Version
# - Storage Driver
# - Logging Driver
# - Cgroup Driver
# - Plugins
# - Swarm status
# - CPUs, Memory
# - Docker Root Dir
```

**Test Run:**
```bash
# Run hello-world
docker run hello-world

# Expected output:
# Hello from Docker!
# This message shows that your installation...
```

**Service Status (Linux):**
```bash
# Check Docker service
sudo systemctl status docker

# Should show: active (running)
```

**Verify Components:**
```bash
# Check if Docker daemon is running
docker ps

# List images
docker images

# Show Docker disk usage
docker system df
```

**Troubleshooting:**
```bash
# If permission denied
sudo usermod -aG docker $USER
newgrp docker

# If service not running
sudo systemctl start docker
sudo systemctl enable docker

# Check logs
journalctl -xu docker.service
```

---

## Additional Basic Questions

### 16. What is Docker Compose?

**Answer:**

Docker Compose is a tool for defining and running multi-container Docker applications.

**Key Features:**
- Define services in YAML file
- Single command to start all services
- Manage multi-container apps
- Service dependencies
- Environment configuration

**Basic docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    depends_on:
      - api

  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

**Common Commands:**
```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs

# List services
docker compose ps

# Rebuild services
docker compose build
```

---

### 17. What are Docker volumes?

**Answer:**

Volumes are the preferred mechanism for persisting data generated by Docker containers.

**Types:**

1. **Named Volumes:**
```bash
docker volume create mydata
docker run -v mydata:/data nginx
```

2. **Anonymous Volumes:**
```bash
docker run -v /data nginx
```

3. **Bind Mounts:**
```bash
docker run -v /host/path:/container/path nginx
```

**Advantages:**
- Persist data
- Share between containers
- Backup and restore
- Better performance
- Platform independent

**Commands:**
```bash
# Create volume
docker volume create myvolume

# List volumes
docker volume ls

# Inspect volume
docker volume inspect myvolume

# Remove volume
docker volume rm myvolume

# Prune unused volumes
docker volume prune
```

---

### 18. What are Docker networks?

**Answer:**

Docker networks allow containers to communicate with each other and external networks.

**Network Types:**

1. **Bridge (Default):**
```bash
docker network create mybridge
docker run --network mybridge nginx
```

2. **Host:**
```bash
docker run --network host nginx
```

3. **None:**
```bash
docker run --network none nginx
```

4. **Overlay:**
```bash
docker network create --driver overlay myoverlay
```

**Commands:**
```bash
# List networks
docker network ls

# Create network
docker network create mynetwork

# Connect container
docker network connect mynetwork container

# Disconnect
docker network disconnect mynetwork container

# Inspect
docker network inspect mynetwork

# Remove
docker network rm mynetwork
```

---

### 19. How do you view logs in Docker?

**Answer:**

**Basic Logs:**
```bash
# View all logs
docker logs CONTAINER

# Follow logs (real-time)
docker logs -f CONTAINER

# Last 100 lines
docker logs --tail 100 CONTAINER

# Since timestamp
docker logs --since 2023-01-01 CONTAINER

# With timestamps
docker logs -t CONTAINER
```

**Docker Compose:**
```bash
# All services
docker compose logs

# Specific service
docker compose logs web

# Follow
docker compose logs -f

# Last N lines
docker compose logs --tail=50
```

**Advanced:**
```bash
# Multiple containers
docker logs container1 container2

# Logs since 1 hour ago
docker logs --since 1h CONTAINER

# Between timestamps
docker logs --since 2023-01-01T00:00:00 --until 2023-01-02T00:00:00 CONTAINER
```

---

### 20. How do you remove Docker containers and images?

**Answer:**

**Remove Containers:**
```bash
# Stop and remove
docker rm CONTAINER

# Force remove running container
docker rm -f CONTAINER

# Remove all stopped containers
docker container prune

# Remove all containers (careful!)
docker rm -f $(docker ps -aq)
```

**Remove Images:**
```bash
# Remove image
docker rmi IMAGE

# Force remove
docker rmi -f IMAGE

# Remove unused images
docker image prune

# Remove all images
docker rmi $(docker images -q)
```

**System Cleanup:**
```bash
# Remove stopped containers, unused networks, dangling images
docker system prune

# Remove everything
docker system prune -a

# Include volumes
docker system prune -a --volumes

# Check disk usage
docker system df
```

**Remove Volumes:**
```bash
# Remove volume
docker volume rm VOLUME

# Remove unused volumes
docker volume prune
```

**Remove Networks:**
```bash
# Remove network
docker network rm NETWORK

# Remove unused networks
docker network prune
```

---

**Continue to:** [02. Images & Containers Questions →](02-images-containers-questions.md)

**Return to:** [Interview Preparation Index →](README.md)

