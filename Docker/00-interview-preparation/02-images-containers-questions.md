# Docker Images & Containers Interview Questions

Advanced questions about Docker images, containers, Dockerfile best practices, and optimization.

---

## Table of Contents

- [Docker Images](#docker-images)
- [Dockerfile Best Practices](#dockerfile-best-practices)
- [Multi-stage Builds](#multi-stage-builds)
- [Container Management](#container-management)
- [Image Optimization](#image-optimization)
- [Registry Operations](#registry-operations)

---

## Docker Images

### 1. What are Docker image layers?

**Answer:**

Docker images are built up from a series of read-only layers, each representing a Dockerfile instruction.

**Layer Architecture:**

```
Image Layers (Read-Only)
┌────────────────────────────┐
│ Layer 4: CMD ["node"]      │
├────────────────────────────┤
│ Layer 3: COPY app.js       │
├────────────────────────────┤
│ Layer 2: RUN npm install   │
├────────────────────────────┤
│ Layer 1: FROM node:18      │
└────────────────────────────┘

Container (Read-Write Layer)
┌────────────────────────────┐
│ Container Layer            │
│ (writable)                 │
└────────────────────────────┘
```

**Example:**

```dockerfile
FROM ubuntu:20.04          # Layer 1
RUN apt-get update         # Layer 2
RUN apt-get install -y curl # Layer 3
COPY app.js /app/          # Layer 4
CMD ["node", "/app/app.js"] # Layer 5
```

**Key Concepts:**

1. **Layer Caching:**

```bash
# First build
docker build -t myapp .  # All layers created

# Second build (no changes)
docker build -t myapp .  # Uses cache, instant

# Change app.js only
docker build -t myapp .  # Layers 1-3 cached, 4-5 rebuilt
```

2. **Layer Sharing:**

```
Image A: node:18 → npm install → copy app1.js
Image B: node:18 → npm install → copy app2.js

Shared: node:18, npm install
Unique: app1.js, app2.js
```

**Benefits:**

- Faster builds (caching)
- Efficient storage (sharing)
- Quick deployment
- Version control

**View Layers:**

```bash
# Show image history
docker history IMAGE

# Inspect layers
docker inspect IMAGE
```

---

### 2. How does Docker image caching work?

**Answer:**

Docker caches each layer and reuses it if the instruction and context haven't changed.

**Cache Validation Rules:**

1. **FROM instruction:**

   - Cache valid if base image unchanged

2. **RUN instruction:**

   - Cache valid if command string identical

3. **COPY/ADD instructions:**

   - Cache valid if file checksums match

4. **Other instructions:**
   - Cache valid if instruction text identical

**Example:**

```dockerfile
# ❌ Poor caching
FROM node:18
COPY . .                    # Invalidates cache often
RUN npm install             # Rebuilds every time

# ✅ Good caching
FROM node:18
COPY package*.json ./       # Only changes when dependencies change
RUN npm install             # Cached when package.json unchanged
COPY . .                    # Code changes don't affect npm install
```

**Cache Behavior:**

```bash
# Build 1: Creates all layers
docker build -t app .

# Build 2: Same files
docker build -t app .
# Output: Using cache (for all steps)

# Build 3: Change app.js only
docker build -t app .
# Output:
# - Using cache (FROM, package.json, npm install)
# - Not using cache (COPY . .)
```

**Control Caching:**

```bash
# Disable cache
docker build --no-cache -t app .

# Pull fresh base image
docker build --pull -t app .

# Cache from specific image
docker build --cache-from=app:latest -t app:new .
```

**Best Practices:**

```dockerfile
# Order by change frequency
FROM node:18               # Changes rarely
WORKDIR /app              # Never changes
COPY package*.json ./     # Changes occasionally
RUN npm install           # Depends on package.json
COPY . .                  # Changes often
CMD ["node", "server.js"] # Rarely changes
```

---

### 3. What is the difference between COPY and ADD in Dockerfile?

**Answer:**

| Aspect              | COPY                   | ADD                   |
| ------------------- | ---------------------- | --------------------- |
| **Purpose**         | Copy files/directories | Copy + extra features |
| **Use Case**        | Simple file copying    | Archives, URLs        |
| **Auto-extraction** | No                     | Yes (tar files)       |
| **URL Support**     | No                     | Yes                   |
| **Transparency**    | Clear, explicit        | Magical, less clear   |
| **Recommendation**  | Preferred              | Use sparingly         |

**COPY Examples:**

```dockerfile
# Copy single file
COPY package.json /app/

# Copy directory
COPY src/ /app/src/

# Copy with rename
COPY app.js /app/server.js

# Copy multiple
COPY package.json yarn.lock /app/

# Copy with wildcard
COPY *.json /app/

# Copy from specific stage
COPY --from=builder /app/dist /app/
```

**ADD Examples:**

```dockerfile
# Same as COPY
ADD app.js /app/

# Auto-extract tar
ADD application.tar.gz /app/
# Automatically extracts to /app/

# Download from URL (not recommended)
ADD https://example.com/file.tar.gz /tmp/

# Better alternative for URLs
RUN curl -O https://example.com/file.tar.gz \
    && tar -xzf file.tar.gz \
    && rm file.tar.gz
```

**When to Use:**

**Use COPY when:**

- Simple file copying
- Most cases (default choice)
- Want explicit behavior

**Use ADD when:**

- Auto-extracting archives
- Absolutely necessary

**Best Practice Example:**

```dockerfile
# ✅ Preferred
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ❌ Avoid unless needed
FROM node:18
WORKDIR /app
ADD package*.json ./    # No benefit over COPY
ADD . .                 # No benefit over COPY

# ✅ Valid ADD use
ADD app.tar.gz /app/    # Auto-extracts
```

**COPY vs ADD Decision Tree:**

```
Need to copy files?
├─ Just copying? → Use COPY
├─ Need to extract tar? → Use ADD
└─ Need from URL? → Use RUN with curl/wget
```

---

### 4. What is .dockerignore and why use it?

**Answer:**

`.dockerignore` file specifies files and directories to exclude from the build context sent to Docker daemon.

**Purpose:**

- Reduce build context size
- Faster builds
- Avoid sending sensitive files
- Exclude unnecessary files

**Syntax:**

```
# .dockerignore

# Node.js
node_modules/
npm-debug.log*
*.log

# Git
.git/
.gitignore

# Documentation
*.md
docs/
README.md

# Environment files
.env
.env.local
.env*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build artifacts
dist/
build/
*.tmp

# OS files
.DS_Store
Thumbs.db

# Test files
test/
tests/
*.test.js
coverage/

# Negation (include specific files)
!README.md

# Wildcard patterns
**/*.log
temp*
```

**Impact Example:**

```bash
# Without .dockerignore
Sending build context to Docker daemon: 2.5GB
Step 1/5 : FROM node:18

# With .dockerignore
Sending build context to Docker daemon: 45MB
Step 1/5 : FROM node:18

# 98% reduction in build context!
```

**Real-world Example:**

```
# Project structure
project/
├── node_modules/     (300MB)
├── dist/             (50MB)
├── .git/             (100MB)
├── coverage/         (20MB)
├── src/              (5MB) ← needed
├── package.json      (5KB) ← needed
├── Dockerfile
└── .dockerignore

# .dockerignore
node_modules/
dist/
.git/
coverage/

# Result: Build context: 5MB instead of 470MB
```

**Common Patterns:**

**Node.js Project:**

```
node_modules/
npm-debug.log
.npm
.node_repl_history
coverage/
.nyc_output/
dist/
build/
.env*
```

**Python Project:**

```
__pycache__/
*.py[cod]
*$py.class
.Python
venv/
env/
.venv/
*.egg-info/
.pytest_cache/
```

**General:**

```
.git/
.gitignore
.dockerignore
Dockerfile
docker-compose.yml
*.md
.vscode/
.idea/
```

---

## Dockerfile Best Practices

### 5. What are Dockerfile best practices?

**Answer:**

**1. Use Official Base Images:**

```dockerfile
# ✅ Good
FROM node:18-alpine

# ❌ Avoid
FROM ubuntu
RUN apt-get install node
```

**2. Use Specific Tags:**

```dockerfile
# ✅ Good
FROM node:18.17.0-alpine

# ❌ Avoid
FROM node:latest
FROM node
```

**3. Minimize Layers:**

```dockerfile
# ❌ Multiple layers
RUN apt-get update
RUN apt-get install -y package1
RUN apt-get install -y package2

# ✅ Single layer
RUN apt-get update && apt-get install -y \
    package1 \
    package2 \
    && rm -rf /var/lib/apt/lists/*
```

**4. Order by Change Frequency:**

```dockerfile
# ✅ Good order
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./      # Changes rarely
RUN npm install            # Depends on above
COPY . .                   # Changes often
CMD ["node", "server.js"]  # Almost never changes
```

**5. Use Multi-stage Builds:**

```dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

**6. Don't Run as Root:**

```dockerfile
# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Switch to user
USER nodejs

# Or use existing user
USER node
```

**7. Use .dockerignore:**

```
node_modules/
.git/
*.md
.env
```

**8. Minimize Image Size:**

```dockerfile
# Use alpine
FROM node:18-alpine

# Clean up in same layer
RUN apk add --no-cache python3 \
    && npm install \
    && apk del python3

# Use npm ci instead of npm install
RUN npm ci --only=production
```

**9. Add Health Checks:**

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js || exit 1
```

**10. Use Labels:**

```dockerfile
LABEL maintainer="dev@example.com"
LABEL version="1.0"
LABEL description="My application"
```

**Complete Example:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

LABEL stage=builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

LABEL maintainer="dev@example.com" \
      version="1.0.0" \
      description="Production Node.js application"

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node healthcheck.js || exit 1

# Start application
CMD ["node", "dist/server.js"]
```

---

### 6. How do you optimize Docker image size?

**Answer:**

**1. Use Alpine Base Images:**

```dockerfile
# Before: 900MB
FROM node:18

# After: 170MB
FROM node:18-alpine
```

**2. Multi-stage Builds:**

```dockerfile
# Before: Single stage (1.2GB)
FROM node:18
COPY . .
RUN npm install
RUN npm run build

# After: Multi-stage (200MB)
FROM node:18 AS builder
COPY . .
RUN npm install && npm run build

FROM node:18-alpine
COPY --from=builder /app/dist ./dist
```

**3. Minimize Layers:**

```dockerfile
# ❌ 3 layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y wget

# ✅ 1 layer
RUN apt-get update && \
    apt-get install -y curl wget && \
    rm -rf /var/lib/apt/lists/*
```

**4. Clean Up in Same Layer:**

```dockerfile
# ❌ Still keeps cache
RUN apt-get update
RUN apt-get install -y python
RUN apt-get clean

# ✅ Cleans in same layer
RUN apt-get update && \
    apt-get install -y python && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

**5. Use --no-install-recommends:**

```dockerfile
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    package-name && \
    rm -rf /var/lib/apt/lists/*
```

**6. npm ci vs npm install:**

```dockerfile
# Larger
RUN npm install

# Smaller, faster
RUN npm ci --only=production
```

**7. Remove Development Dependencies:**

```dockerfile
FROM node:18-alpine
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force
```

**8. Optimize with dive:**

```bash
# Install dive
docker pull wagoodman/dive

# Analyze image
dive myimage:latest
```

**Complete Optimization Example:**

```dockerfile
# ❌ Before (1.5GB)
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]

# ✅ After (80MB)
# Build stage
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy only necessary files
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**Size Comparison:**

```
Original:     1.5GB
After Alpine: 600MB
After Multi:  200MB
After Optim:  80MB
Reduction:    94.6%
```

---

## Multi-stage Builds

### 7. What are multi-stage builds and why use them?

**Answer:**

Multi-stage builds allow you to use multiple FROM statements in your Dockerfile, with each stage having its own purpose.

**Benefits:**

- Smaller final images
- Separate build and runtime dependencies
- Keep development tools out of production
- Better organization
- Improved security

**Basic Example:**

```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

**Size Impact:**

```
Single stage: 1.2GB (includes build tools, dev dependencies)
Multi-stage:  180MB (only runtime dependencies)
Savings:      85% smaller
```

**Advanced Example - Multiple Stages:**

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm run test

# Stage 3: Production
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

**Real-world Go Example:**

```dockerfile
# Builder
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
CMD ["./main"]

# Result: 15MB vs 800MB with single stage
```

**Python Example:**

```dockerfile
# Builder
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# Final
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache /wheels/*
COPY . .
CMD ["python", "app.py"]
```

**Target Specific Stage:**

```bash
# Build only builder stage
docker build --target builder -t myapp:builder .

# Build to production
docker build --target runner -t myapp:prod .

# Use in docker-compose
services:
  app-dev:
    build:
      context: .
      target: builder
```

---

## Container Management

### 8. How do you manage container lifecycle?

**Answer:**

**Container States:**

```
Created → Running → Paused → Stopped → Removed
```

**1. Create:**

```bash
# Create without starting
docker create --name myapp nginx

# Create from Dockerfile
docker build -t myapp .
```

**2. Start:**

```bash
# Start existing container
docker start myapp

# Create and start
docker run -d --name myapp nginx

# Start with logs
docker start -a myapp
```

**3. Stop:**

```bash
# Graceful stop (SIGTERM, then SIGKILL after 10s)
docker stop myapp

# With custom timeout
docker stop -t 30 myapp

# Force stop (SIGKILL immediately)
docker kill myapp
```

**4. Restart:**

```bash
# Restart container
docker restart myapp

# With timeout
docker restart -t 10 myapp
```

**5. Pause/Unpause:**

```bash
# Freeze container processes
docker pause myapp

# Resume
docker unpause myapp
```

**6. Remove:**

```bash
# Remove stopped container
docker rm myapp

# Force remove running container
docker rm -f myapp

# Remove with volumes
docker rm -v myapp
```

**Complete Lifecycle Example:**

```bash
# 1. Create
docker create --name webapp -p 8080:80 nginx
# Status: Created

# 2. Start
docker start webapp
# Status: Running

# 3. Pause (optional)
docker pause webapp
# Status: Paused

# 4. Unpause
docker unpause webapp
# Status: Running

# 5. Stop
docker stop webapp
# Status: Stopped

# 6. Restart
docker restart webapp
# Status: Running

# 7. Stop again
docker stop webapp
# Status: Stopped

# 8. Remove
docker rm webapp
# Status: Removed
```

**Restart Policies:**

```bash
# No restart (default)
docker run --restart=no nginx

# Always restart
docker run --restart=always nginx

# Restart on failure
docker run --restart=on-failure nginx

# Restart unless stopped
docker run --restart=unless-stopped nginx

# With max retries
docker run --restart=on-failure:3 nginx
```

**Update Running Container:**

```bash
# Update restart policy
docker update --restart=always myapp

# Update resource limits
docker update --memory="1g" --cpus="2" myapp
```

---

### 9. How do you monitor Docker containers?

**Answer:**

**1. Container Stats:**

```bash
# Real-time stats
docker stats

# Specific container
docker stats myapp

# No streaming
docker stats --no-stream

# Format output
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

**2. Logs:**

```bash
# View logs
docker logs myapp

# Follow logs
docker logs -f myapp

# Last N lines
docker logs --tail 100 myapp

# With timestamps
docker logs -t myapp

# Since timestamp
docker logs --since 2023-01-01T00:00:00 myapp
```

**3. Inspect:**

```bash
# Full details
docker inspect myapp

# Specific field
docker inspect --format='{{.State.Status}}' myapp
docker inspect --format='{{.NetworkSettings.IPAddress}}' myapp

# Multiple containers
docker inspect myapp1 myapp2
```

**4. Top (Processes):**

```bash
# View processes
docker top myapp

# With custom ps options
docker top myapp aux
```

**5. Events:**

```bash
# Monitor events
docker events

# Filter by container
docker events --filter container=myapp

# Filter by event type
docker events --filter event=start
```

**6. Health Check:**

```dockerfile
# In Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD curl -f http://localhost/ || exit 1
```

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' myapp
```

**Monitoring Stack with Docker:**

```yaml
# docker-compose.yml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus

  cadvisor:
    image: gcr.io/cadvisor/cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
```

**Third-party Tools:**

- Prometheus + Grafana
- cAdvisor
- Datadog
- New Relic
- Sysdig

---

## Image Optimization

### 10. How do you debug a Docker container?

**Answer:**

**1. Execute Shell in Container:**

```bash
# Interactive shell
docker exec -it myapp bash
docker exec -it myapp sh  # For alpine

# Single command
docker exec myapp ls -la /app

# As root
docker exec -u root -it myapp bash
```

**2. View Logs:**

```bash
# Container logs
docker logs -f myapp

# Docker daemon logs (Linux)
sudo journalctl -u docker.service

# System logs
docker events
```

**3. Inspect Container:**

```bash
# Full inspect
docker inspect myapp

# Network info
docker inspect --format='{{json .NetworkSettings}}' myapp

# Mounts
docker inspect --format='{{json .Mounts}}' myapp

# Environment
docker inspect --format='{{json .Config.Env}}' myapp
```

**4. Check Processes:**

```bash
# Running processes
docker top myapp

# Process tree
docker exec myapp ps auxf
```

**5. File System:**

```bash
# Copy from container
docker cp myapp:/app/logs/error.log ./

# Copy to container
docker cp ./config.json myapp:/app/

# Check disk usage
docker exec myapp df -h

# Find large files
docker exec myapp du -sh /app/*
```

**6. Network Debugging:**

```bash
# Check network
docker network inspect bridge

# Test connectivity
docker exec myapp ping google.com
docker exec myapp curl http://api:3000

# Check ports
docker exec myapp netstat -tuln
docker port myapp
```

**7. Debug Dockerfile:**

```bash
# Build with no cache
docker build --no-cache -t myapp .

# Build specific stage
docker build --target builder -t myapp:debug .

# Run intermediate stage
docker run -it myapp:debug sh
```

**8. Attach to Container:**

```bash
# Attach to running container
docker attach myapp

# Detach: Ctrl+P, Ctrl+Q
```

**9. Check Resources:**

```bash
# Stats
docker stats myapp

# Memory usage
docker exec myapp free -m

# CPU usage
docker exec myapp top
```

**10. Common Issues:**

**Container Exits Immediately:**

```bash
# Check exit code
docker ps -a

# View logs
docker logs myapp

# Run with shell to investigate
docker run -it myapp sh
```

**Permission Issues:**

```bash
# Run as root
docker exec -u root -it myapp bash

# Check file permissions
docker exec myapp ls -la /app

# Fix permissions
docker exec -u root myapp chown -R node:node /app
```

**Network Issues:**

```bash
# Check DNS
docker exec myapp cat /etc/resolv.conf
docker exec myapp nslookup google.com

# Check connectivity
docker exec myapp ping 8.8.8.8
docker exec myapp curl -v http://api:3000
```

**Debug Container that Won't Start:**

```bash
# Override entrypoint
docker run -it --entrypoint sh myapp

# Run with bash
docker run -it --entrypoint bash myapp

# Check what command would run
docker inspect --format='{{.Config.Cmd}}' myapp
```

---

**Continue to:** [03. Networking & Volumes Questions →](03-networking-volumes-questions.md)

**Return to:** [Interview Preparation Index →](README.md)
