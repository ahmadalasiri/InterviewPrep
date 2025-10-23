# Docker Learning Resources

A comprehensive guide to Docker containerization, from basics to advanced concepts, with practical examples and interview preparation materials.

## 📚 Contents

### 00. Interview Preparation

Complete set of interview questions with detailed answers:

- [Basic Questions](00-interview-preparation/01-basic-questions.md) - Docker fundamentals, containers vs VMs, basic commands
- [Images & Containers Questions](00-interview-preparation/02-images-containers-questions.md) - Dockerfile, multi-stage builds, optimization
- [Networking & Volumes Questions](00-interview-preparation/03-networking-volumes-questions.md) - Network modes, volumes, data persistence
- [Docker Compose Questions](00-interview-preparation/04-compose-questions.md) - Multi-container apps, service configuration
- [Advanced Questions](00-interview-preparation/05-advanced-questions.md) - Security, performance, orchestration, CI/CD
- [Practical Scenarios](00-interview-preparation/06-practical-questions.md) - Real-world problems, migration, troubleshooting

### 01. Basics

Essential Docker commands and concepts:

- [Basic Dockerfile Examples](01-basics/Dockerfile.basic) - Simple Dockerfiles for various languages
- [Docker Commands Reference](01-basics/docker-commands.sh) - Comprehensive command reference

### 02. Images

Image creation and optimization:

- [Multi-stage Builds](02-images/multi-stage.Dockerfile) - Optimized build examples

### 03. Networking & Volumes

Network and storage configuration:

- [Network Configuration](03-networking-volumes/docker-compose-network.yml) - Network examples
- [Volume Management](03-networking-volumes/docker-compose-volumes.yml) - Volume configurations

### 04. Docker Compose

Multi-container applications:

- [Compose Examples](04-compose/docker-compose-examples.yml) - Complete compose configurations

### 05. Advanced

Advanced Docker techniques:

- [Optimized Dockerfiles](05-advanced/Dockerfile.optimized) - Production-ready builds

### 06. Security

Security best practices:

- [Secure Dockerfiles](06-security/Dockerfile.secure) - Security-hardened examples

### 07. Production

Production deployment strategies:

- [Production Setup](07-production/docker-compose.production.yml) - Complete production configuration

## 🚀 Quick Start

### Installation

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
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

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
docker compose version
```

**Windows:**

```bash
# Enable WSL 2
wsl --install

# Download and install Docker Desktop from:
# https://www.docker.com/products/docker-desktop

# Verify in PowerShell
docker --version
docker compose version
```

### First Container

```bash
# Run your first container
docker run hello-world

# Run interactive Ubuntu container
docker run -it ubuntu bash

# Run Nginx web server
docker run -d -p 8080:80 nginx

# Check running containers
docker ps

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>
```

### First Dockerfile

Create a simple Node.js application:

**app.js:**

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Docker!\n");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY app.js .

EXPOSE 3000

CMD ["node", "app.js"]
```

**Build and run:**

```bash
# Build image
docker build -t myapp:1.0 .

# Run container
docker run -d -p 3000:3000 myapp:1.0

# Test
curl http://localhost:3000

# View logs
docker logs <container-id>
```

### First Docker Compose

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"

  api:
    build: ./api
    ports:
      - "3000:3000"
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

**Run:**

```bash
# Start all services
docker compose up -d

# View status
docker compose ps

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

## 📖 Learning Path

### Beginner (Week 1-2)

1. **Understanding Docker** - What and why

   - Containerization concepts
   - Docker vs Virtual Machines
   - Docker architecture
   - Installation and setup

2. **Basic Commands**

   - Running containers
   - Managing images
   - Container lifecycle
   - Basic troubleshooting

3. **Creating Images**
   - Writing Dockerfiles
   - Building images
   - Understanding layers
   - Basic optimization

### Intermediate (Week 3-4)

4. **Docker Compose**

   - Multi-container applications
   - Service configuration
   - Networks and volumes
   - Environment management

5. **Networking**

   - Network modes
   - Service discovery
   - Port mapping
   - Custom networks

6. **Data Management**
   - Volumes vs bind mounts
   - Data persistence
   - Backup strategies
   - Volume drivers

### Advanced (Week 5-6)

7. **Optimization**

   - Multi-stage builds
   - Image size reduction
   - Build caching
   - Layer optimization

8. **Security**

   - Security best practices
   - User permissions
   - Secrets management
   - Vulnerability scanning

9. **Production**
   - Orchestration (Swarm/Kubernetes)
   - CI/CD integration
   - Monitoring and logging
   - Scaling strategies

### Interview Preparation

- Review all interview question files
- Practice hands-on with examples
- Build real projects
- Understand common pitfalls
- Study production scenarios

## 🎯 Common Use Cases

### Development Environment

```yaml
version: "3.8"

services:
  app:
    build: .
    volumes:
      - ./src:/app/src # Hot reload
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
```

### Microservices

```yaml
version: "3.8"

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"

  user-service:
    build: ./services/user

  product-service:
    build: ./services/product

  order-service:
    build: ./services/order

  postgres:
    image: postgres:15

  redis:
    image: redis:alpine
```

### CI/CD Pipeline

```yaml
# .github/workflows/docker.yml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build image
        run: docker build -t myapp:latest .

      - name: Run tests
        run: docker run myapp:latest npm test

      - name: Push to registry
        run: |
          docker tag myapp:latest registry.example.com/myapp:latest
          docker push registry.example.com/myapp:latest
```

## 🛠️ Essential Commands Cheat Sheet

### Images

```bash
docker build -t name:tag .          # Build image
docker pull image:tag               # Pull from registry
docker push image:tag               # Push to registry
docker images                       # List images
docker rmi image                    # Remove image
docker tag source target            # Tag image
docker history image                # View image layers
```

### Containers

```bash
docker run image                    # Run container
docker run -d image                 # Run detached
docker run -it image bash           # Interactive
docker run -p 8080:80 image        # Port mapping
docker run -v /host:/container      # Volume mount
docker ps                           # List running
docker ps -a                        # List all
docker stop container               # Stop container
docker start container              # Start container
docker rm container                 # Remove container
docker logs container               # View logs
docker exec -it container bash      # Execute command
```

### Docker Compose

```bash
docker compose up                   # Start services
docker compose up -d                # Start detached
docker compose down                 # Stop and remove
docker compose logs                 # View logs
docker compose ps                   # List services
docker compose build                # Build services
docker compose pull                 # Pull images
docker compose exec service cmd     # Execute command
```

### System

```bash
docker system df                    # Disk usage
docker system prune                 # Clean up
docker system prune -a              # Remove all unused
docker volume ls                    # List volumes
docker network ls                   # List networks
docker info                         # System info
```

## 📝 Best Practices

### Dockerfile

```dockerfile
# ✅ Use specific tags
FROM node:18.17.0-alpine3.18

# ✅ Use multi-stage builds
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
COPY --from=builder /app/dist ./dist

# ✅ Don't run as root
RUN adduser -D -u 1001 nodeuser
USER nodeuser

# ✅ Use health checks
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js || exit 1
```

### Docker Compose

```yaml
# ✅ Use environment variables
environment:
  - DB_HOST=${DB_HOST}
  - DB_PASSWORD=${DB_PASSWORD}

# ✅ Set resource limits
deploy:
  resources:
    limits:
      cpus: "2"
      memory: 2G

# ✅ Use health checks
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3

# ✅ Configure logging
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Security

```bash
# ✅ Scan images
docker scan myimage:latest

# ✅ Use secrets
docker secret create my_secret secret.txt

# ✅ Run with limited privileges
docker run --user 1001:1001 \
  --read-only \
  --cap-drop=ALL \
  --security-opt=no-new-privileges:true \
  myimage

# ✅ Update regularly
docker pull image:latest
```

### Production

```yaml
# ✅ Use specific versions
image: myapp:1.2.3

# ✅ Set restart policy
restart: unless-stopped

# ✅ Configure logging
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

# ✅ Use health checks
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 🔗 Additional Resources

See [resources.md](resources.md) for:

- Official documentation
- Interactive tutorials
- Video courses
- Books and articles
- Practice platforms
- Community resources

## 🎓 Practice Projects

### Beginner Projects

1. **Simple Web Server**

   - Containerize a static website
   - Use Nginx
   - Practice basic commands

2. **Node.js API**

   - Create REST API
   - Use Docker Compose
   - Add database

3. **Multi-Container App**
   - Frontend + Backend + Database
   - Use Docker Compose
   - Configure networking

### Intermediate Projects

1. **Microservices**

   - Multiple services
   - Service discovery
   - API gateway

2. **Full-Stack Application**

   - React frontend
   - Node.js backend
   - PostgreSQL database
   - Redis cache

3. **CI/CD Pipeline**
   - Automated builds
   - Testing
   - Deployment

### Advanced Projects

1. **Production Deployment**

   - Load balancing
   - Health checks
   - Monitoring
   - Logging

2. **Kubernetes Migration**

   - Convert Docker Compose
   - Deploy to K8s
   - Scaling and updates

3. **Complete DevOps Pipeline**
   - Source control
   - CI/CD
   - Monitoring
   - Alerting

## 🆘 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs container-name

# Check events
docker events

# Inspect container
docker inspect container-name

# Try running with shell
docker run -it --entrypoint sh image-name
```

### Networking Issues

```bash
# Check network
docker network inspect network-name

# Test connectivity
docker exec container ping other-container

# Check DNS
docker exec container cat /etc/resolv.conf
```

### Storage Issues

```bash
# Check disk usage
docker system df

# Clean up
docker system prune -a

# Remove volumes
docker volume prune
```

### Performance Issues

```bash
# Check stats
docker stats

# View resource usage
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Size}}"

# Check logs
docker logs --tail 100 container-name
```

## 📞 Getting Help

```bash
# Command help
docker --help
docker run --help
docker compose --help

# Man pages
man docker
man docker-compose

# Quick reference
docker command -h
```

## 🏆 Skills Checklist

### Basic Skills

- [ ] Understand containerization concepts
- [ ] Install and configure Docker
- [ ] Run and manage containers
- [ ] Build images from Dockerfile
- [ ] Use Docker Compose
- [ ] Manage volumes and networks

### Intermediate Skills

- [ ] Optimize Dockerfiles
- [ ] Multi-stage builds
- [ ] Custom networking
- [ ] Data persistence strategies
- [ ] Docker Compose in production
- [ ] Basic security practices

### Advanced Skills

- [ ] Container orchestration
- [ ] CI/CD integration
- [ ] Production deployment
- [ ] Monitoring and logging
- [ ] Security hardening
- [ ] Performance optimization

## 📜 License

This learning resource is for educational purposes. Docker is licensed under Apache License 2.0.

---

**Happy Learning! 🚀**

Remember: Docker is best learned by doing. Build real projects and experiment with different configurations!




