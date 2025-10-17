# Docker Practical Scenarios Interview Questions

Real-world problems, solutions, best practices, and common pitfalls.

---

## Table of Contents

- [Migration Scenarios](#migration-scenarios)
- [Production Issues](#production-issues)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Common Pitfalls](#common-pitfalls)
- [Best Practices Implementation](#best-practices-implementation)

---

## Migration Scenarios

### 1. How would you migrate an existing application to Docker?

**Answer:**

**Step-by-Step Migration:**

**1. Assess the Application:**

```bash
# Identify:
# - Programming language and runtime
# - Dependencies
# - Database and external services
# - Configuration files
# - Data persistence needs
# - Environment variables
```

**2. Create Dockerfile:**

```dockerfile
# Example: Node.js application
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js || exit 1

# Start application
CMD ["node", "server.js"]
```

**3. Create .dockerignore:**

```
node_modules
npm-debug.log
.env
.git
*.md
.vscode
coverage
dist
```

**4. Create docker-compose.yml:**

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      REDIS_URL: redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - app-uploads:/app/uploads
      - app-logs:/app/logs

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
  app-uploads:
  app-logs:
```

**5. Migration Plan:**

**Phase 1: Development Environment**

```bash
# 1. Build image
docker compose build

# 2. Test locally
docker compose up

# 3. Verify application works
curl http://localhost:3000/health

# 4. Test all features
# Run integration tests
docker compose exec app npm test
```

**Phase 2: Database Migration**

```bash
# 1. Backup existing database
pg_dump -h old-server -U admin myapp > backup.sql

# 2. Start new containerized database
docker compose up -d postgres

# 3. Import data
docker compose exec -T postgres psql -U admin myapp < backup.sql

# 4. Verify data
docker compose exec postgres psql -U admin myapp -c "SELECT COUNT(*) FROM users;"
```

**Phase 3: Staging Deployment**

```bash
# 1. Deploy to staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# 2. Run smoke tests
./scripts/smoke-tests.sh

# 3. Performance testing
./scripts/load-test.sh

# 4. Monitor for 24 hours
```

**Phase 4: Production Deployment**

```bash
# 1. Blue-Green Deployment
# Start new environment
docker compose -f docker-compose.prod.yml up -d --scale app=3

# 2. Health check
for i in {1..30}; do
  curl -f http://localhost/health && break || sleep 10
done

# 3. Switch traffic (update load balancer)
# 4. Monitor
# 5. Keep old environment running for rollback

# 6. After verification, stop old environment
```

**Complete Migration Example:**

**Legacy Application (VM):**

```
Server: Ubuntu 20.04
Runtime: Node.js 18
Database: PostgreSQL 13
Cache: Redis 6
Files: /var/www/uploads
```

**Dockerized Application:**

**Directory Structure:**

```
myapp/
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── .dockerignore
├── .env.example
├── scripts/
│   ├── migrate.sh
│   ├── backup.sh
│   └── restore.sh
├── src/
└── README.md
```

**Dockerfile:**

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js || exit 1

CMD ["node", "dist/server.js"]
```

**Migration Script:**

```bash
#!/bin/bash
# scripts/migrate.sh

set -e

echo "=== Migration to Docker ==="

# 1. Backup existing data
echo "Step 1: Backing up data..."
./scripts/backup.sh

# 2. Build Docker images
echo "Step 2: Building images..."
docker compose build

# 3. Start database
echo "Step 3: Starting database..."
docker compose up -d postgres redis
sleep 10

# 4. Restore data
echo "Step 4: Restoring data..."
./scripts/restore.sh

# 5. Start application
echo "Step 5: Starting application..."
docker compose up -d app

# 6. Health check
echo "Step 6: Health checking..."
for i in {1..30}; do
  if curl -f http://localhost:3000/health; then
    echo "✓ Application is healthy"
    break
  fi
  echo "Waiting for application... ($i/30)"
  sleep 10
done

# 7. Smoke tests
echo "Step 7: Running smoke tests..."
./scripts/smoke-tests.sh

echo "=== Migration complete ==="
```

---

### 2. How do you handle zero-downtime deployments with Docker?

**Answer:**

**Strategy 1: Blue-Green Deployment**

```yaml
# docker-compose.blue.yml
version: "3.8"

services:
  app-blue:
    image: myapp:${BLUE_VERSION}
    container_name: app-blue
    environment:
      - COLOR=blue
    networks:
      - app-network

networks:
  app-network:
    external: true
```

```yaml
# docker-compose.green.yml
version: "3.8"

services:
  app-green:
    image: myapp:${GREEN_VERSION}
    container_name: app-green
    environment:
      - COLOR=green
    networks:
      - app-network

networks:
  app-network:
    external: true
```

**Deployment Script:**

```bash
#!/bin/bash
# deploy-blue-green.sh

CURRENT_COLOR=$(curl -s http://localhost/api/color)
NEW_VERSION=$1

if [ "$CURRENT_COLOR" == "blue" ]; then
  NEW_COLOR="green"
  OLD_COLOR="blue"
else
  NEW_COLOR="blue"
  OLD_COLOR="green"
fi

echo "Current: $OLD_COLOR, Deploying: $NEW_COLOR"

# 1. Start new version
export ${NEW_COLOR^^}_VERSION=$NEW_VERSION
docker compose -f docker-compose.$NEW_COLOR.yml up -d

# 2. Health check
echo "Waiting for $NEW_COLOR to be healthy..."
for i in {1..30}; do
  if docker exec app-$NEW_COLOR curl -f http://localhost/health; then
    echo "✓ $NEW_COLOR is healthy"
    break
  fi
  sleep 2
done

# 3. Update load balancer to point to new version
./scripts/update-lb.sh $NEW_COLOR

# 4. Wait and monitor
sleep 30

# 5. Stop old version
echo "Stopping $OLD_COLOR..."
docker compose -f docker-compose.$OLD_COLOR.yml down

echo "Deployment complete!"
```

**Strategy 2: Rolling Update (Docker Swarm)**

```yaml
# docker-stack.yml
version: "3.8"

services:
  app:
    image: myapp:${VERSION}
    deploy:
      replicas: 6
      update_config:
        parallelism: 2 # Update 2 at a time
        delay: 10s # Wait 10s between batches
        failure_action: rollback
        monitor: 60s
        max_failure_ratio: 0.3
      rollback_config:
        parallelism: 2
        delay: 5s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
```

**Deploy:**

```bash
# Initial deployment
docker stack deploy -c docker-stack.yml myapp

# Update to new version
export VERSION=2.0
docker service update --image myapp:2.0 myapp_app

# Watch rollout
watch docker service ps myapp_app

# Rollback if needed
docker service rollback myapp_app
```

**Strategy 3: Canary Deployment**

```yaml
version: "3.8"

services:
  # Stable version (90% traffic)
  app-stable:
    image: myapp:1.0
    deploy:
      replicas: 9
      labels:
        - "traefik.weight=90"
    networks:
      - app-network

  # Canary version (10% traffic)
  app-canary:
    image: myapp:2.0
    deploy:
      replicas: 1
      labels:
        - "traefik.weight=10"
    networks:
      - app-network

  # Load balancer
  traefik:
    image: traefik:latest
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - app-network

networks:
  app-network:
```

**Canary Deployment Process:**

```bash
# 1. Deploy canary (10% traffic)
docker compose up -d app-canary

# 2. Monitor metrics
./scripts/monitor-canary.sh

# 3. If successful, gradually increase
docker compose up -d --scale app-canary=3 --scale app-stable=7

# 4. Continue until 100%
docker compose up -d --scale app-canary=10 --scale app-stable=0

# 5. Remove old version
docker compose rm -f app-stable
```

**Strategy 4: Health Check Based**

```yaml
version: "3.8"

services:
  app:
    image: myapp:${VERSION}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 40s
    deploy:
      replicas: 3
      update_config:
        order: start-first # Start new before stopping old
        failure_action: rollback
```

**Complete Zero-Downtime Deployment:**

```bash
#!/bin/bash
# zero-downtime-deploy.sh

set -e

NEW_VERSION=$1
HEALTH_ENDPOINT="http://localhost/health"
REPLICAS=5

echo "=== Zero-Downtime Deployment to v$NEW_VERSION ==="

# 1. Pull new image
echo "Pulling new image..."
docker pull myapp:$NEW_VERSION

# 2. Start new containers gradually
for i in $(seq 1 $REPLICAS); do
  echo "Starting new container $i/$REPLICAS..."

  # Start new container
  CONTAINER_ID=$(docker run -d \
    --name app-new-$i \
    --network app-network \
    myapp:$NEW_VERSION)

  # Wait for health check
  echo "Waiting for container to be healthy..."
  for j in {1..30}; do
    if docker exec $CONTAINER_ID curl -f $HEALTH_ENDPOINT 2>/dev/null; then
      echo "✓ Container $i is healthy"
      break
    fi
    sleep 2
  done

  # Add to load balancer
  ./scripts/lb-add.sh $CONTAINER_ID

  # If this is not the last container, stop one old container
  if [ $i -lt $REPLICAS ]; then
    OLD_CONTAINER=$(docker ps --filter "name=app-old" --format "{{.Names}}" | head -1)
    if [ ! -z "$OLD_CONTAINER" ]; then
      echo "Stopping old container: $OLD_CONTAINER"
      ./scripts/lb-remove.sh $OLD_CONTAINER
      docker stop $OLD_CONTAINER
      docker rm $OLD_CONTAINER
    fi
  fi

  # Brief pause
  sleep 5
done

# 3. Stop remaining old containers
echo "Stopping remaining old containers..."
docker ps --filter "name=app-old" --format "{{.Names}}" | while read name; do
  ./scripts/lb-remove.sh $name
  docker stop $name
  docker rm $name
done

# 4. Rename new containers
for i in $(seq 1 $REPLICAS); do
  docker rename app-new-$i app-old-$i
done

echo "=== Deployment complete ==="
```

---

## Production Issues

### 3. How do you handle Docker storage issues in production?

**Answer:**

**Common Storage Issues:**

**1. Disk Space Full:**

**Identify:**

```bash
# Check Docker disk usage
docker system df

# Detailed view
docker system df -v

# Check specific locations
du -sh /var/lib/docker/volumes/*
du -sh /var/lib/docker/containers/*/*-json.log
```

**Solution:**

```bash
# Clean up stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Complete cleanup
docker system prune -a -f --volumes

# Set up log rotation
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

**2. Log Files Growing:**

**Problem:**

```bash
# Logs consuming disk
du -sh /var/lib/docker/containers/*/*-json.log
# 10G /var/lib/docker/containers/abc123.../abc123-json.log
```

**Solution:**

```yaml
# docker-compose.yml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        compress: "true"
```

**Or use external logging:**

```yaml
services:
  app:
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://192.168.1.100:514"
```

**3. Volume Permissions:**

**Problem:**

```bash
# Application can't write to volume
docker logs app
# Error: EACCES: permission denied, open '/data/file.txt'
```

**Solution:**

```dockerfile
# Set correct user in Dockerfile
FROM node:18-alpine

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Create volume directory with correct permissions
RUN mkdir -p /data && \
    chown -R appuser:appgroup /data

USER appuser

VOLUME ["/data"]
```

**Or fix at runtime:**

```bash
# Run init container to fix permissions
docker run --rm \
  -v myvolume:/data \
  alpine \
  chown -R 1001:1001 /data
```

**4. Volume Backup Strategy:**

```bash
#!/bin/bash
# backup-volumes.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d-%H%M%S)

# Backup volume
backup_volume() {
  local volume=$1
  local backup_file="$BACKUP_DIR/${volume}-${DATE}.tar.gz"

  echo "Backing up $volume..."

  docker run --rm \
    -v $volume:/source:ro \
    -v $BACKUP_DIR:/backup \
    alpine \
    tar czf /backup/$(basename $backup_file) -C /source .

  echo "✓ Backup saved: $backup_file"
}

# Backup all volumes
docker volume ls -q | while read volume; do
  backup_volume $volume
done

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

**5. Storage Driver Issues:**

**Check current driver:**

```bash
docker info | grep "Storage Driver"
```

**Switch to overlay2 (if needed):**

```json
// /etc/docker/daemon.json
{
  "storage-driver": "overlay2"
}
```

```bash
# Backup images
docker save $(docker images -q) -o images-backup.tar

# Stop Docker
sudo systemctl stop docker

# Remove old data
sudo rm -rf /var/lib/docker

# Start Docker (will use new driver)
sudo systemctl start docker

# Restore images
docker load -i images-backup.tar
```

**Monitoring Script:**

```bash
#!/bin/bash
# monitor-storage.sh

THRESHOLD=80
ALERT_EMAIL="admin@example.com"

check_disk_usage() {
  local usage=$(df -h /var/lib/docker | awk 'NR==2 {print $5}' | sed 's/%//')

  if [ $usage -gt $THRESHOLD ]; then
    echo "WARNING: Docker disk usage at ${usage}%"

    # Send alert
    echo "Docker disk usage: ${usage}%" | mail -s "Docker Storage Alert" $ALERT_EMAIL

    # Auto cleanup
    docker system prune -f
  fi
}

check_log_size() {
  local total_size=$(du -sb /var/lib/docker/containers | awk '{print $1}')
  local size_gb=$((total_size / 1024 / 1024 / 1024))

  if [ $size_gb -gt 10 ]; then
    echo "WARNING: Container logs at ${size_gb}GB"

    # Find large logs
    find /var/lib/docker/containers -name "*-json.log" -size +100M
  fi
}

# Run checks
check_disk_usage
check_log_size
```

---

## Monitoring and Logging

### 4. How do you implement monitoring for Docker containers?

**Answer:**

**Complete Monitoring Stack:**

```yaml
# docker-compose.monitoring.yml
version: "3.8"

services:
  # Application
  app:
    image: myapp:latest
    labels:
      - "prometheus.scrape=true"
      - "prometheus.port=9090"
    networks:
      - monitoring

  # Prometheus - Metrics collection
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=30d"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - monitoring
    restart: unless-stopped

  # Grafana - Visualization
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./grafana/datasources:/etc/grafana/provisioning/datasources:ro
    ports:
      - "3000:3000"
    networks:
      - monitoring
    depends_on:
      - prometheus
    restart: unless-stopped

  # cAdvisor - Container metrics
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
      - /dev/disk:/dev/disk:ro
    ports:
      - "8080:8080"
    networks:
      - monitoring
    restart: unless-stopped

  # Node Exporter - Host metrics
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    command:
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"
      - "--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    ports:
      - "9100:9100"
    networks:
      - monitoring
    restart: unless-stopped

  # Loki - Log aggregation
  loki:
    image: grafana/loki:latest
    container_name: loki
    command: -config.file=/etc/loki/local-config.yaml
    volumes:
      - loki-data:/loki
    ports:
      - "3100:3100"
    networks:
      - monitoring
    restart: unless-stopped

  # Promtail - Log shipping
  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    command: -config.file=/etc/promtail/config.yml
    volumes:
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./promtail-config.yml:/etc/promtail/config.yml:ro
    networks:
      - monitoring
    restart: unless-stopped

  # Alertmanager - Alerts
  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    command:
      - "--config.file=/etc/alertmanager/config.yml"
      - "--storage.path=/alertmanager"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/config.yml:ro
      - alertmanager-data:/alertmanager
    ports:
      - "9093:9093"
    networks:
      - monitoring
    restart: unless-stopped

volumes:
  prometheus-data:
  grafana-data:
  loki-data:
  alertmanager-data:

networks:
  monitoring:
    driver: bridge
```

**prometheus.yml:**

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

rule_files:
  - "alerts.yml"

scrape_configs:
  # Docker containers
  - job_name: "docker"
    static_configs:
      - targets: ["cadvisor:8080"]

  # Node metrics
  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]

  # Application metrics
  - job_name: "app"
    static_configs:
      - targets: ["app:9090"]

  # Prometheus itself
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
```

**alerts.yml:**

```yaml
groups:
  - name: docker_alerts
    interval: 30s
    rules:
      - alert: ContainerDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Container is down"
          description: "{{ $labels.instance }} has been down for more than 1 minute."

      - alert: HighMemoryUsage
        expr: (container_memory_usage_bytes / container_spec_memory_limit_bytes) > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Container {{ $labels.name }} is using >90% memory for 5 minutes."

      - alert: HighCPUUsage
        expr: rate(container_cpu_usage_seconds_total[5m]) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "Container {{ $labels.name }} is using >80% CPU for 5 minutes."

      - alert: DiskSpaceWillFillIn4Hours
        expr: predict_linear(node_filesystem_free_bytes[1h], 4*3600) < 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space will fill soon"
          description: "Disk on {{ $labels.instance }} will fill in approximately 4 hours."
```

**Logging Configuration:**

```yaml
# Application with structured logging
services:
  app:
    image: myapp:latest
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "app,environment"
        tag: "{{.Name}}/{{.ID}}"
    labels:
      logging: "promtail"
      logging_jobname: "app"
```

**Health Check Dashboard Script:**

```bash
#!/bin/bash
# health-dashboard.sh

echo "=== Docker Container Health Dashboard ==="
echo

# Container status
echo "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.State}}"
echo

# Resource usage
echo "Resource Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
echo

# Health checks
echo "Health Checks:"
docker ps --format "{{.Names}}" | while read name; do
  health=$(docker inspect --format='{{.State.Health.Status}}' $name 2>/dev/null || echo "no health check")
  echo "$name: $health"
done
echo

# Disk usage
echo "Disk Usage:"
docker system df
```

---

## Backup and Recovery

### 5. What is your backup and disaster recovery strategy for Docker?

**Answer:**

**Comprehensive Backup Strategy:**

**1. Image Backup:**

```bash
#!/bin/bash
# backup-images.sh

BACKUP_DIR="/backups/images"
DATE=$(date +%Y%m%d)

mkdir -p $BACKUP_DIR

# Backup all images
docker images --format "{{.Repository}}:{{.Tag}}" | while read image; do
  filename=$(echo $image | tr '/:' '_')
  echo "Backing up $image..."
  docker save $image | gzip > "$BACKUP_DIR/${filename}-${DATE}.tar.gz"
done

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

**2. Volume Backup:**

```bash
#!/bin/bash
# backup-volumes.sh

BACKUP_DIR="/backups/volumes"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR

backup_volume() {
  local volume=$1
  local backup_file="$BACKUP_DIR/${volume}-${DATE}.tar.gz"

  echo "Backing up volume: $volume..."

  # Stop containers using this volume (optional)
  # containers=$(docker ps -q --filter volume=$volume)
  # [ ! -z "$containers" ] && docker stop $containers

  # Backup
  docker run --rm \
    -v $volume:/source:ro \
    -v $BACKUP_DIR:/backup \
    alpine \
    tar czf /backup/$(basename $backup_file) -C /source .

  # Restart containers (if stopped)
  # [ ! -z "$containers" ] && docker start $containers

  echo "✓ Backup completed: $backup_file"
}

# Backup all volumes
docker volume ls -q | while read volume; do
  backup_volume $volume
done
```

**3. Container Configuration Backup:**

```bash
#!/bin/bash
# backup-configs.sh

BACKUP_DIR="/backups/configs"
DATE=$(date +%Y%m%d)

mkdir -p $BACKUP_DIR

# Backup docker-compose files
find . -name "docker-compose*.yml" -exec cp {} $BACKUP_DIR/ \;

# Backup environment files
find . -name ".env*" -exec cp {} $BACKUP_DIR/ \;

# Backup Dockerfiles
find . -name "Dockerfile*" -exec cp {} $BACKUP_DIR/ \;

# Backup nginx configs
find . -name "nginx.conf" -exec cp {} $BACKUP_DIR/ \;

# Create archive
tar czf "$BACKUP_DIR/configs-${DATE}.tar.gz" $BACKUP_DIR/*.{yml,env,conf}

# Cleanup old backups
find $BACKUP_DIR -name "configs-*.tar.gz" -mtime +90 -delete
```

**4. Database Backup:**

```bash
#!/bin/bash
# backup-databases.sh

BACKUP_DIR="/backups/databases"
DATE=$(date +%Y%m%d-%H%M)

mkdir -p $BACKUP_DIR

# PostgreSQL backup
backup_postgres() {
  local container=$1
  local database=$2
  local backup_file="$BACKUP_DIR/postgres-${database}-${DATE}.sql.gz"

  echo "Backing up PostgreSQL database: $database..."

  docker exec $container pg_dump -U postgres $database | gzip > $backup_file

  echo "✓ Backup completed: $backup_file"
}

# MongoDB backup
backup_mongo() {
  local container=$1
  local database=$2
  local backup_dir="$BACKUP_DIR/mongo-${database}-${DATE}"

  echo "Backing up MongoDB database: $database..."

  docker exec $container mongodump --db $database --out /tmp/backup
  docker cp $container:/tmp/backup $backup_dir
  tar czf "${backup_dir}.tar.gz" $backup_dir
  rm -rf $backup_dir

  echo "✓ Backup completed: ${backup_dir}.tar.gz"
}

# MySQL backup
backup_mysql() {
  local container=$1
  local database=$2
  local backup_file="$BACKUP_DIR/mysql-${database}-${DATE}.sql.gz"

  echo "Backing up MySQL database: $database..."

  docker exec $container mysqldump -u root -p${MYSQL_ROOT_PASSWORD} $database | gzip > $backup_file

  echo "✓ Backup completed: $backup_file"
}

# Run backups
backup_postgres "postgres" "myapp"
backup_mongo "mongodb" "myapp"
backup_mysql "mysql" "myapp"

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

**5. Complete Backup Script:**

```bash
#!/bin/bash
# full-backup.sh

set -e

BACKUP_ROOT="/backups"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/full-$DATE"

mkdir -p $BACKUP_DIR

echo "=== Full Docker Backup Started ==="
echo "Backup directory: $BACKUP_DIR"

# 1. Backup configurations
echo "1. Backing up configurations..."
./backup-configs.sh

# 2. Backup databases
echo "2. Backing up databases..."
./backup-databases.sh

# 3. Backup volumes
echo "3. Backing up volumes..."
./backup-volumes.sh

# 4. Backup images (optional - can be rebuilt)
# echo "4. Backing up images..."
# ./backup-images.sh

# 5. Export container state
echo "5. Exporting container state..."
docker ps -a --format "{{.Names}}" > "$BACKUP_DIR/containers.txt"
docker ps -a --format "{{.Names}}\t{{.Image}}\t{{.Status}}" > "$BACKUP_DIR/container-status.txt"

# 6. Backup Docker daemon config
echo "6. Backing up Docker configuration..."
cp /etc/docker/daemon.json "$BACKUP_DIR/" 2>/dev/null || true

# 7. Create manifest
echo "7. Creating manifest..."
cat > "$BACKUP_DIR/manifest.txt" << EOF
Backup Date: $DATE
Docker Version: $(docker version --format '{{.Server.Version}}')
Compose Version: $(docker compose version --short)
Host: $(hostname)
Containers: $(docker ps -q | wc -l) running, $(docker ps -aq | wc -l) total
Images: $(docker images -q | wc -l)
Volumes: $(docker volume ls -q | wc -l)
Networks: $(docker network ls -q | wc -l)
EOF

# 8. Upload to remote storage (S3, etc.)
echo "8. Uploading to remote storage..."
# aws s3 cp $BACKUP_DIR s3://mybucket/backups/ --recursive

# 9. Cleanup old local backups (keep 3 days)
find $BACKUP_ROOT -name "full-*" -mtime +3 -exec rm -rf {} \;

echo "=== Full Docker Backup Completed ==="
```

**6. Restore Procedures:**

```bash
#!/bin/bash
# restore.sh

BACKUP_DIR=$1

if [ -z "$BACKUP_DIR" ]; then
  echo "Usage: ./restore.sh <backup-directory>"
  exit 1
fi

echo "=== Docker Restore Started ==="
echo "From: $BACKUP_DIR"

# 1. Stop all containers
echo "1. Stopping all containers..."
docker stop $(docker ps -q) 2>/dev/null || true

# 2. Restore volumes
echo "2. Restoring volumes..."
find $BACKUP_DIR -name "*.tar.gz" | while read backup; do
  volume=$(basename $backup | sed 's/-[0-9].*\.tar\.gz//')
  echo "Restoring volume: $volume"

  docker volume create $volume
  docker run --rm \
    -v $volume:/target \
    -v $BACKUP_DIR:/backup \
    alpine \
    tar xzf /backup/$(basename $backup) -C /target
done

# 3. Restore databases
echo "3. Restoring databases..."
# PostgreSQL
if [ -f "$BACKUP_DIR/postgres-*.sql.gz" ]; then
  docker compose up -d postgres
  sleep 10
  gunzip < $BACKUP_DIR/postgres-*.sql.gz | docker exec -i postgres psql -U postgres
fi

# 4. Start services
echo "4. Starting services..."
docker compose up -d

# 5. Verify
echo "5. Verifying..."
sleep 10
docker compose ps
docker compose logs --tail=50

echo "=== Docker Restore Completed ==="
```

**7. Automated Backup with Cron:**

```bash
# Add to crontab
# crontab -e

# Daily full backup at 2 AM
0 2 * * * /opt/docker/scripts/full-backup.sh >> /var/log/docker-backup.log 2>&1

# Hourly database backup
0 * * * * /opt/docker/scripts/backup-databases.sh >> /var/log/docker-db-backup.log 2>&1

# Weekly image backup
0 0 * * 0 /opt/docker/scripts/backup-images.sh >> /var/log/docker-image-backup.log 2>&1
```

---

## Common Pitfalls

### 6. What are common Docker mistakes and how to avoid them?

**Answer:**

**1. Running as Root:**

**❌ Bad:**

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
CMD ["node", "server.js"]
# Runs as root!
```

**✅ Good:**

```dockerfile
FROM node:18
WORKDIR /app
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

CMD ["node", "server.js"]
```

**2. Using Latest Tag:**

**❌ Bad:**

```dockerfile
FROM node:latest  # Unpredictable!
```

**✅ Good:**

```dockerfile
FROM node:18.17.0-alpine3.18  # Specific and reproducible
```

**3. Not Using .dockerignore:**

**❌ Bad:**

```bash
# Sends everything to build context
docker build .
# Sending build context: 2.5GB
```

**✅ Good:**

```
# .dockerignore
node_modules
.git
*.log
.env
dist
```

**4. Installing Unnecessary Packages:**

**❌ Bad:**

```dockerfile
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    curl \
    wget \
    vim \
    git
# Huge image size!
```

**✅ Good:**

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*
# Or use multi-stage builds
```

**5. Not Cleaning Up in Same Layer:**

**❌ Bad:**

```dockerfile
RUN apt-get update
RUN apt-get install -y python3
RUN apt-get clean  # Too late, already in different layers!
```

**✅ Good:**

```dockerfile
RUN apt-get update && \
    apt-get install -y python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

**6. Hardcoding Secrets:**

**❌ Bad:**

```dockerfile
ENV DB_PASSWORD=secret123
ENV API_KEY=abcdef123456
```

**✅ Good:**

```bash
# Pass at runtime
docker run -e DB_PASSWORD=$DB_PASSWORD myapp

# Or use secrets
docker secret create db_password password.txt
```

**7. Not Using Health Checks:**

**❌ Bad:**

```dockerfile
FROM node:18
CMD ["node", "server.js"]
# No health check!
```

**✅ Good:**

```dockerfile
FROM node:18
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js || exit 1
CMD ["node", "server.js"]
```

**8. Binding to 0.0.0.0 with Privileged Ports:**

**❌ Bad:**

```bash
docker run -p 80:80 myapp  # Exposed to all interfaces
```

**✅ Good:**

```bash
docker run -p 127.0.0.1:80:80 myapp  # Only localhost
# Or use reverse proxy
```

**9. Not Setting Resource Limits:**

**❌ Bad:**

```yaml
services:
  app:
    image: myapp
    # No limits - can consume all resources!
```

**✅ Good:**

```yaml
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G
```

**10. Ignoring Container Logs:**

**❌ Bad:**

```yaml
services:
  app:
    image: myapp
    # Logs grow indefinitely!
```

**✅ Good:**

```yaml
services:
  app:
    image: myapp
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## Best Practices Implementation

### 7. Implement a complete production-ready Docker setup

**Answer:**

**Complete Production Setup:**

**Directory Structure:**

```
production-app/
├── .env.example
├── .gitignore
├── .dockerignore
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── app/
│   ├── src/
│   ├── package.json
│   └── healthcheck.js
├── scripts/
│   ├── deploy.sh
│   ├── backup.sh
│   ├── restore.sh
│   └── monitoring.sh
└── docs/
    ├── deployment.md
    └── troubleshooting.md
```

**Dockerfile (Multi-stage, Optimized):**

```dockerfile
# syntax=docker/dockerfile:1.4

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies with cache mount
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production && \
    npm cache clean --force

# Build application
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy artifacts with correct ownership
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs healthcheck.js ./

# Security: Switch to non-root user
USER nodejs

# Environment
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=2048"

# Port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js || exit 1

# Labels
LABEL maintainer="devops@example.com" \
      version="1.0.0" \
      description="Production Node.js application"

# Start with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

**docker-compose.prod.yml:**

```yaml
version: "3.8"

services:
  nginx:
    build: ./nginx
    image: myapp-nginx:${VERSION}
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - static-files:/usr/share/nginx/html:ro
    networks:
      - frontend
    depends_on:
      - app
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
      cache_from:
        - myapp:latest
    image: myapp:${VERSION}
    container_name: app
    user: "1001:1001"
    read_only: true
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    security_opt:
      - no-new-privileges:true
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      REDIS_URL: redis://redis:6379
    secrets:
      - db_password
      - jwt_secret
    volumes:
      - app-uploads:/app/uploads
      - app-logs:/app/logs
    networks:
      - frontend
      - backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "2"
          memory: 2G
        reservations:
          cpus: "1"
          memory: 512M
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "production,app"

  postgres:
    image: postgres:15-alpine
    container_name: postgres
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - backend
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 4G
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  redis:
    image: redis:7-alpine
    container_name: redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  postgres-data:
    driver: local
  redis-data:
    driver: local
  app-uploads:
    driver: local
  app-logs:
    driver: local
  static-files:
    driver: local

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

This completes the Docker interview preparation materials!

---

**Return to:** [Interview Preparation Index →](README.md)
