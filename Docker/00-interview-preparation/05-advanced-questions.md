# Docker Advanced Interview Questions

Advanced questions covering security, performance, orchestration, CI/CD, and production deployments.

---

## Table of Contents

- [Docker Security](#docker-security)
- [Performance Optimization](#performance-optimization)
- [Docker Swarm](#docker-swarm)
- [Kubernetes Integration](#kubernetes-integration)
- [CI/CD Integration](#cicd-integration)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## Docker Security

### 1. What are Docker security best practices?

**Answer:**

**1. Use Official and Verified Images:**

```dockerfile
# ✅ Good
FROM node:18-alpine

# ❌ Avoid
FROM random-user/node
```

**2. Don't Run as Root:**

```dockerfile
# Create non-root user
FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Switch to non-root user
USER nodejs

# Set proper permissions
COPY --chown=nodejs:nodejs . /app
```

**3. Use Specific Image Tags:**

```dockerfile
# ✅ Good - specific version
FROM node:18.17.0-alpine3.18

# ❌ Avoid - mutable tags
FROM node:latest
FROM node:18
```

**4. Scan Images for Vulnerabilities:**

```bash
# Using Docker Scout
docker scout cve myimage:latest

# Using Trivy
trivy image myimage:latest

# Using Snyk
snyk container test myimage:latest
```

**5. Minimize Image Surface:**

```dockerfile
# Multi-stage to exclude build tools
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production with minimal surface
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/server.js"]
```

**6. Don't Include Secrets:**

```dockerfile
# ❌ Never do this
ENV API_KEY=secret123
ENV DB_PASSWORD=password

# ✅ Use secrets management
# Pass at runtime
docker run -e API_KEY=${API_KEY} myapp

# Or use Docker secrets
docker secret create api_key api_key.txt
```

**7. Use Read-Only Filesystem:**

```bash
docker run --read-only --tmpfs /tmp myapp
```

```yaml
# docker-compose.yml
services:
  app:
    image: myapp
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

**8. Limit Container Resources:**

```bash
docker run \
  --memory="512m" \
  --cpus="1.0" \
  --pids-limit=100 \
  myapp
```

```yaml
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

**9. Use Security Options:**

```bash
# Disable new privileges
docker run --security-opt=no-new-privileges myapp

# Use AppArmor
docker run --security-opt apparmor=docker-default myapp

# Use SELinux
docker run --security-opt label=level:s0:c100,c200 myapp
```

**10. Drop Capabilities:**

```dockerfile
# Drop all, add only needed
FROM alpine
RUN apk add --no-cache libcap
RUN setcap cap_net_bind_service=+ep /usr/bin/myapp
USER nobody
CMD ["myapp"]
```

```yaml
services:
  app:
    image: myapp
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

**Complete Secure Dockerfile:**

```dockerfile
# Use specific version
FROM node:18.17.0-alpine3.18 AS builder

# Build arguments
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:18.17.0-alpine3.18

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./

# Security: Switch to non-root
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node healthcheck.js || exit 1

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/server.js"]
```

**docker-compose.yml with Security:**

```yaml
version: "3.8"

services:
  app:
    build: .
    image: myapp:latest

    # Don't run as root
    user: "1001:1001"

    # Read-only filesystem
    read_only: true
    tmpfs:
      - /tmp

    # Drop capabilities
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE

    # Security options
    security_opt:
      - no-new-privileges:true

    # Resource limits
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 512M

    # Secrets (not environment variables)
    secrets:
      - db_password
      - api_key

    # Health check
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 3s
      retries: 3

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    file: ./secrets/api_key.txt
```

---

### 2. How do you secure Docker daemon and API?

**Answer:**

**1. Enable TLS for Docker Daemon:**

```bash
# Generate CA
openssl genrsa -aes256 -out ca-key.pem 4096
openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem

# Generate server cert
openssl genrsa -out server-key.pem 4096
openssl req -subj "/CN=docker-host" -sha256 -new -key server-key.pem -out server.csr

# Sign server cert
openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem \
  -CAcreateserial -out server-cert.pem

# Generate client cert
openssl genrsa -out key.pem 4096
openssl req -subj '/CN=client' -new -key key.pem -out client.csr
openssl x509 -req -days 365 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem \
  -CAcreateserial -out cert.pem

# Configure daemon
# /etc/docker/daemon.json
{
  "tls": true,
  "tlscacert": "/etc/docker/ca.pem",
  "tlscert": "/etc/docker/server-cert.pem",
  "tlskey": "/etc/docker/server-key.pem",
  "tlsverify": true,
  "hosts": ["tcp://0.0.0.0:2376", "unix:///var/run/docker.sock"]
}

# Restart Docker
sudo systemctl restart docker

# Use with client
docker --tlsverify \
  --tlscacert=ca.pem \
  --tlscert=cert.pem \
  --tlskey=key.pem \
  -H=tcp://docker-host:2376 ps
```

**2. Restrict Access to Docker Socket:**

```bash
# Don't expose socket to containers (security risk)
# ❌ Dangerous
docker run -v /var/run/docker.sock:/var/run/docker.sock myapp

# ✅ If needed, use read-only
docker run -v /var/run/docker.sock:/var/run/docker.sock:ro myapp

# Better: Use Docker API with authentication
```

**3. Use User Namespaces:**

```bash
# Enable user namespaces
# /etc/docker/daemon.json
{
  "userns-remap": "default"
}

sudo systemctl restart docker
```

**4. Configure Authorization Plugin:**

```bash
# Install authorization plugin
docker plugin install authz-plugin

# Configure
{
  "authorization-plugins": ["authz-plugin"]
}
```

**5. Audit Docker Events:**

```bash
# Enable audit logging
# /etc/audit/rules.d/docker.rules
-w /usr/bin/docker -k docker
-w /var/lib/docker -k docker
-w /etc/docker -k docker
-w /lib/systemd/system/docker.service -k docker
-w /lib/systemd/system/docker.socket -k docker

# Restart auditd
sudo systemctl restart auditd

# View audit logs
sudo ausearch -k docker
```

**6. Limit Docker API Access:**

```bash
# Use firewall
sudo ufw allow from 10.0.0.0/24 to any port 2376

# Or use iptables
sudo iptables -A INPUT -p tcp -s 10.0.0.0/24 --dport 2376 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 2376 -j DROP
```

---

## Performance Optimization

### 3. How do you optimize Docker container performance?

**Answer:**

**1. Optimize Image Size:**

```dockerfile
# Use alpine base
FROM node:18-alpine  # ~170MB vs node:18 ~900MB

# Multi-stage builds
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
COPY --from=builder /app/dist ./dist
# Result: Much smaller image
```

**2. Layer Caching:**

```dockerfile
# ❌ Poor caching
COPY . .
RUN npm install

# ✅ Good caching
COPY package*.json ./
RUN npm install
COPY . .
# Only rebuilds if package.json changes
```

**3. Use BuildKit:**

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Or in daemon.json
{
  "features": {
    "buildkit": true
  }
}

# BuildKit features:
# - Parallel builds
# - Better caching
# - Secrets support
```

**4. Resource Limits:**

```yaml
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G
        reservations:
          cpus: "1"
          memory: 512M
```

**5. Use tmpfs for Temporary Files:**

```yaml
services:
  app:
    image: myapp
    tmpfs:
      - /tmp
      - /var/cache
      - /app/temp
```

**6. Optimize Networking:**

```bash
# Use host network for performance-critical apps
docker run --network host myapp

# Or optimize bridge settings
# /etc/docker/daemon.json
{
  "bip": "172.17.0.1/16",
  "mtu": 1500,
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

**7. Use Volume Caching:**

```bash
# Delegated (faster writes)
docker run -v $(pwd):/app:delegated myapp

# Cached (faster reads)
docker run -v $(pwd):/app:cached myapp
```

**8. Optimize Storage Driver:**

```bash
# Use overlay2 (default, fastest)
{
  "storage-driver": "overlay2"
}
```

**9. Application-Level Optimization:**

```dockerfile
FROM node:18-alpine

# Production dependencies only
ENV NODE_ENV=production
RUN npm ci --only=production

# Remove unused files
RUN rm -rf /root/.npm /tmp/*

# Optimize Node.js
ENV NODE_OPTIONS="--max-old-space-size=2048"

CMD ["node", "--max-old-space-size=2048", "server.js"]
```

**10. Monitor and Profile:**

```bash
# Monitor resources
docker stats

# Profile container
docker run --cpus="1" --memory="512m" \
  --name myapp myapp:latest

# Check performance
docker exec myapp top
docker exec myapp ps aux
```

**Complete Optimized Example:**

```dockerfile
# syntax=docker/dockerfile:1.4

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY --link package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production

# Build app
COPY --link . .
RUN npm run build && \
    npm prune --production

# Production stage
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy artifacts
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs

# Optimize Node.js
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"

EXPOSE 3000

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

**docker-compose.yml Optimized:**

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      cache_from:
        - myapp:latest
    image: myapp:latest

    # Resource optimization
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G

    # tmpfs for temporary files
    tmpfs:
      - /tmp
      - /app/cache

    # Logging optimization
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

    # Network optimization
    networks:
      - app-network

    # Health check
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

networks:
  app-network:
    driver: bridge
    driver_opts:
      com.docker.network.driver.mtu: 1500
```

---

## Docker Swarm

### 4. What is Docker Swarm and how does it work?

**Answer:**

Docker Swarm is Docker's native clustering and orchestration tool.

**Key Features:**

- Multi-host deployment
- Service discovery
- Load balancing
- Scaling
- Rolling updates
- High availability

**Swarm Architecture:**

```
Swarm Cluster
├── Manager Nodes (Raft consensus)
│   ├── Leader (Active)
│   └── Followers (Standby)
└── Worker Nodes (Run tasks)
    ├── Worker 1
    ├── Worker 2
    └── Worker 3
```

**Initialize Swarm:**

```bash
# On manager node
docker swarm init --advertise-addr 192.168.1.100

# Output provides join token for workers
# docker swarm join --token SWMTKN-1-xxx 192.168.1.100:2377
```

**Add Nodes:**

```bash
# Get worker join token
docker swarm join-token worker

# Get manager join token
docker swarm join-token manager

# On worker node
docker swarm join --token SWMTKN-1-xxx 192.168.1.100:2377

# On manager node
docker swarm join --token SWMTKN-1-xxx 192.168.1.100:2377
```

**Deploy Stack:**

```yaml
# docker-stack.yml
version: "3.8"

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        max_attempts: 3
      placement:
        constraints:
          - node.role == worker
    networks:
      - webnet

  api:
    image: myapi:latest
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
    networks:
      - webnet
      - backend

  db:
    image: postgres:15
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.labels.type == database
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - backend
    secrets:
      - db_password

networks:
  webnet:
  backend:

volumes:
  db-data:

secrets:
  db_password:
    external: true
```

**Deploy and Manage:**

```bash
# Deploy stack
docker stack deploy -c docker-stack.yml myapp

# List stacks
docker stack ls

# List services
docker stack services myapp
docker service ls

# View service logs
docker service logs myapp_web

# Scale service
docker service scale myapp_web=5

# Update service
docker service update --image nginx:latest myapp_web

# Rolling update
docker service update \
  --update-parallelism 2 \
  --update-delay 10s \
  --image myapi:v2 myapp_api

# Remove stack
docker stack rm myapp
```

**Service Discovery:**

```yaml
services:
  web:
    image: nginx
    # Can connect to api via DNS name "api"

  api:
    image: myapi
    # Can connect to db via DNS name "db"

  db:
    image: postgres
```

**Load Balancing:**

```bash
# Swarm provides automatic load balancing
# Requests to published ports are distributed across replicas

# Deploy service with 3 replicas
docker service create \
  --name web \
  --replicas 3 \
  --publish 80:80 \
  nginx

# Traffic automatically balanced across all 3 containers
```

---

## Kubernetes Integration

### 5. How does Docker integrate with Kubernetes?

**Answer:**

**Relationship:**

```
Kubernetes
├── Uses container runtime (Docker, containerd, CRI-O)
├── Orchestrates containers
├── Manages deployments
└── Handles networking and storage
```

**Docker → Kubernetes Migration:**

**Docker Compose:**

```yaml
version: "3.8"

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    environment:
      - ENV=production
```

**Kubernetes Deployment:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
          env:
            - name: ENV
              value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 80
  selector:
    app: web
```

**Using Docker Images in Kubernetes:**

```bash
# Build Docker image
docker build -t myapp:1.0 .

# Tag for registry
docker tag myapp:1.0 registry.example.com/myapp:1.0

# Push to registry
docker push registry.example.com/myapp:1.0

# Use in Kubernetes
kubectl set image deployment/myapp myapp=registry.example.com/myapp:1.0
```

**Docker Desktop with Kubernetes:**

```bash
# Enable Kubernetes in Docker Desktop
# Settings → Kubernetes → Enable Kubernetes

# Verify
kubectl cluster-info
kubectl get nodes
```

**Convert Compose to Kubernetes (Kompose):**

```bash
# Install kompose
curl -L https://github.com/kubernetes/kompose/releases/download/v1.30.0/kompose-linux-amd64 -o kompose
chmod +x kompose
sudo mv kompose /usr/local/bin/

# Convert
kompose convert -f docker-compose.yml

# Deploy to Kubernetes
kubectl apply -f .
```

**Complete Example:**

**Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**Build and Push:**

```bash
# Build
docker build -t myapp:1.0 .

# Tag for registry (Docker Hub, GCR, ECR, etc.)
docker tag myapp:1.0 username/myapp:1.0

# Push
docker push username/myapp:1.0
```

**Kubernetes Deployment:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: username/myapp:1.0
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
          resources:
            limits:
              memory: "512Mi"
              cpu: "500m"
            requests:
              memory: "256Mi"
              cpu: "250m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 3000
  selector:
    app: myapp
```

**Deploy to Kubernetes:**

```bash
# Apply deployment
kubectl apply -f deployment.yml

# Check status
kubectl get pods
kubectl get services

# Scale
kubectl scale deployment myapp --replicas=5

# Update image
kubectl set image deployment/myapp myapp=username/myapp:2.0

# Rollback
kubectl rollout undo deployment/myapp

# View logs
kubectl logs -f deployment/myapp
```

---

## CI/CD Integration

### 6. How do you integrate Docker with CI/CD pipelines?

**Answer:**

**GitHub Actions Example:**

```yaml
# .github/workflows/docker-build.yml
name: Docker Build and Push

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache
          cache-to: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache,mode=max

      - name: Run tests
        run: |
          docker run --rm ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} npm test
```

**GitLab CI Example:**

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
  only:
    - main
    - develop

test:
  stage: test
  image: $IMAGE_TAG
  script:
    - npm test
  only:
    - main
    - develop

deploy:
  stage: deploy
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh $DEPLOY_USER@$DEPLOY_HOST "docker pull $IMAGE_TAG"
    - ssh $DEPLOY_USER@$DEPLOY_HOST "docker stop myapp || true"
    - ssh $DEPLOY_USER@$DEPLOY_HOST "docker rm myapp || true"
    - ssh $DEPLOY_USER@$DEPLOY_HOST "docker run -d --name myapp -p 80:3000 $IMAGE_TAG"
  only:
    - main
  environment:
    name: production
    url: https://myapp.example.com
```

**Jenkins Pipeline:**

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'myapp'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        REGISTRY = 'registry.example.com'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                script {
                    docker.build("${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    docker.image("${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}").inside {
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'registry-credentials') {
                        docker.image("${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}").push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh """
                        docker pull ${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker stop myapp || true
                        docker rm myapp || true
                        docker run -d --name myapp -p 80:3000 ${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
```

**Docker Compose for CI:**

```yaml
# docker-compose.test.yml
version: "3.8"

services:
  app:
    build: .
    environment:
      NODE_ENV: test
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: test_db
      POSTGRES_PASSWORD: test

  redis:
    image: redis:alpine

  test:
    build: .
    command: npm test
    environment:
      NODE_ENV: test
      DB_HOST: db
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis
```

**Run in CI:**

```bash
# Build and test
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Check exit code
docker compose -f docker-compose.test.yml ps
```

---

## Production Deployment

### 7. What are best practices for Docker in production?

**Answer:**

**1. Security:**

```yaml
services:
  app:
    image: myapp:1.0
    user: "1001:1001" # Non-root
    read_only: true # Read-only filesystem
    cap_drop:
      - ALL # Drop all capabilities
    security_opt:
      - no-new-privileges:true
```

**2. Resource Limits:**

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G
        reservations:
          cpus: "1"
          memory: 512M
```

**3. Health Checks:**

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**4. Logging:**

```yaml
services:
  app:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
        labels: "production"
```

**5. Restart Policies:**

```yaml
services:
  app:
    restart: unless-stopped
    # or for Swarm:
    deploy:
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
```

**6. Secrets Management:**

```yaml
services:
  app:
    secrets:
      - db_password
      - api_key
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    external: true
  api_key:
    external: true
```

**7. Monitoring:**

```yaml
services:
  app:
    labels:
      prometheus.scrape: "true"
      prometheus.port: "9090"

  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

**Complete Production Stack:**

```yaml
version: "3.8"

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    networks:
      - frontend
    depends_on:
      - app
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  app:
    image: myapp:${VERSION}
    user: "1001:1001"
    read_only: true
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    environment:
      NODE_ENV: production
      DB_HOST: postgres
    secrets:
      - db_password
    networks:
      - frontend
      - backend
    depends_on:
      postgres:
        condition: service_healthy
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "2"
          memory: 2G
      restart_policy:
        condition: on-failure
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
    secrets:
      - db_password
    networks:
      - backend
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 4G
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  postgres-data:
    driver: local

networks:
  frontend:
  backend:
    internal: true

secrets:
  db_password:
    external: true
```

---

## Troubleshooting

### 8. How do you troubleshoot Docker issues?

**Answer:**

**Common Issues and Solutions:**

**1. Container Won't Start:**

```bash
# Check logs
docker logs container_name
docker logs --tail 50 container_name

# Check exit code
docker ps -a

# Inspect container
docker inspect container_name

# Try running with shell
docker run -it --entrypoint sh image_name
```

**2. Network Issues:**

```bash
# Check network
docker network inspect bridge

# Test connectivity
docker exec container ping google.com
docker exec container curl http://api:3000

# Check DNS
docker exec container cat /etc/resolv.conf

# List ports
docker port container_name
```

**3. Volume Issues:**

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect volume_name

# Check permissions
docker exec container ls -la /path/to/volume

# Fix permissions
docker exec -u root container chown -R user:group /path
```

**4. Performance Issues:**

```bash
# Check resource usage
docker stats

# Check disk usage
docker system df -v

# Check logs size
du -sh /var/lib/docker/containers/*/*-json.log

# Clean up
docker system prune -a
```

**5. Build Issues:**

```bash
# Build with no cache
docker build --no-cache -t myapp .

# Build with progress
docker build --progress=plain -t myapp .

# Check build context size
tar -czh . | wc -c

# Use .dockerignore
```

**Debugging Commands:**

```bash
# Execute shell in running container
docker exec -it container bash

# Run as root
docker exec -u root -it container bash

# View processes
docker top container

# View changes
docker diff container

# Export container filesystem
docker export container > container.tar

# Save image
docker save image > image.tar

# Check image layers
docker history image
```

**Troubleshooting Checklist:**

```bash
# 1. Check if container is running
docker ps -a

# 2. View logs
docker logs -f container

# 3. Inspect container
docker inspect container

# 4. Check resources
docker stats container

# 5. Test connectivity
docker exec container ping host

# 6. Check volumes
docker inspect -f '{{json .Mounts}}' container

# 7. Check environment
docker inspect -f '{{json .Config.Env}}' container

# 8. Check networks
docker inspect -f '{{json .NetworkSettings}}' container
```

---

**Continue to:** [06. Practical Scenarios →](06-practical-questions.md)

**Return to:** [Interview Preparation Index →](README.md)
