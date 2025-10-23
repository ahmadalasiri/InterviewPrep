# Docker Compose Interview Questions

Questions about Docker Compose, multi-container applications, and orchestration fundamentals.

---

## Table of Contents

- [Docker Compose Basics](#docker-compose-basics)
- [Service Configuration](#service-configuration)
- [Compose File Syntax](#compose-file-syntax)
- [Multi-container Applications](#multi-container-applications)
- [Environment Management](#environment-management)
- [Orchestration Fundamentals](#orchestration-fundamentals)

---

## Docker Compose Basics

### 1. What is Docker Compose and when to use it?

**Answer:**

Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file.

**Key Features:**

- Define entire application stack
- Single command operation
- Service dependencies
- Environment configuration
- Volume and network management
- Development to production parity

**When to Use:**

✅ **Use Docker Compose for:**

- Development environments
- Automated testing
- Single-host deployments
- CI/CD pipelines
- Multi-container applications
- Microservices (local development)

❌ **Don't Use for:**

- Production clusters (use Kubernetes/Swarm)
- Multi-host deployments
- Auto-scaling requirements
- Complex orchestration needs

**Basic Example:**

```yaml
# docker-compose.yml
version: "3.8"

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"

  api:
    build: ./api
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
```

**Common Commands:**

```bash
# Start services
docker compose up
docker compose up -d  # Detached mode

# Stop services
docker compose stop
docker compose down   # Remove containers

# View logs
docker compose logs
docker compose logs -f web  # Follow specific service

# List services
docker compose ps

# Build services
docker compose build

# Execute commands
docker compose exec web bash
```

**Complete Real-world Example:**

```yaml
version: "3.8"

services:
  # Load Balancer
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - web

  # Web Application
  web:
    build:
      context: ./web
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - API_URL=http://api:3000
    depends_on:
      - api

  # API Server
  api:
    build: ./api
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  # Database
  postgres:
    image: postgres:15
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: secret

  # Cache
  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

---

### 2. What are the essential Docker Compose commands?

**Answer:**

**Lifecycle Management:**

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# Start specific services
docker compose up web api

# Build before starting
docker compose up --build

# Force recreate
docker compose up --force-recreate

# Stop services
docker compose stop

# Stop and remove
docker compose down

# Remove with volumes
docker compose down -v

# Remove with images
docker compose down --rmi all
```

**Service Management:**

```bash
# List services
docker compose ps

# List all containers (stopped too)
docker compose ps -a

# View service logs
docker compose logs

# Follow logs
docker compose logs -f

# Logs for specific service
docker compose logs web

# Last 100 lines
docker compose logs --tail=100

# With timestamps
docker compose logs -t
```

**Build & Update:**

```bash
# Build services
docker compose build

# Build specific service
docker compose build api

# Build without cache
docker compose build --no-cache

# Pull latest images
docker compose pull

# Push images to registry
docker compose push
```

**Execution:**

```bash
# Execute command in running service
docker compose exec web bash

# Run one-off command
docker compose run api npm test

# Run without starting dependencies
docker compose run --no-deps api npm test

# Remove container after run
docker compose run --rm api npm test
```

**Scaling:**

```bash
# Scale service
docker compose up -d --scale api=3

# Scale multiple services
docker compose up -d --scale api=3 --scale worker=5
```

**Configuration:**

```bash
# Validate compose file
docker compose config

# View resolved configuration
docker compose config --services

# View volumes
docker compose config --volumes

# Render compose file
docker compose config --format yaml
```

**Status & Monitoring:**

```bash
# View running processes
docker compose top

# View events
docker compose events

# View port mappings
docker compose port web 80

# Check images
docker compose images
```

**Cleanup:**

```bash
# Stop and remove containers
docker compose down

# Remove containers and volumes
docker compose down -v

# Remove containers, networks, images
docker compose down --rmi all

# Remove orphan containers
docker compose down --remove-orphans
```

**Complete Workflow Example:**

```bash
# 1. Development - Start services
docker compose up -d

# 2. View logs
docker compose logs -f api

# 3. Execute tests
docker compose exec api npm test

# 4. Rebuild after changes
docker compose up -d --build api

# 5. Scale for load testing
docker compose up -d --scale api=5

# 6. View status
docker compose ps
docker compose top

# 7. Cleanup
docker compose down -v
```

---

## Service Configuration

### 3. How do you configure services in Docker Compose?

**Answer:**

**Complete Service Configuration:**

```yaml
version: "3.8"

services:
  webapp:
    # Image
    image: myapp:latest

    # Or build from Dockerfile
    build:
      context: ./app
      dockerfile: Dockerfile.prod
      args:
        NODE_VERSION: 18
      cache_from:
        - myapp:cache
      target: production

    # Container name
    container_name: webapp

    # Hostname
    hostname: webapp

    # Ports
    ports:
      - "8080:80"
      - "443:443"

    # Expose (internal only)
    expose:
      - "3000"

    # Environment
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      REDIS_URL: redis://redis:6379

    # Environment file
    env_file:
      - .env
      - .env.production

    # Volumes
    volumes:
      - app-data:/app/data
      - ./config:/app/config:ro
      - logs:/app/logs

    # Networks
    networks:
      - frontend
      - backend

    # Dependencies
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

    # Command
    command: node server.js

    # Entrypoint
    entrypoint: ["node"]

    # Working directory
    working_dir: /app

    # User
    user: "node"

    # Restart policy
    restart: unless-stopped

    # Health check
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

    # Resource limits
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G
        reservations:
          cpus: "1"
          memory: 1G

    # Logging
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

    # Labels
    labels:
      com.example.description: "Web application"
      com.example.environment: "production"

    # Security
    security_opt:
      - no-new-privileges:true

    # Capabilities
    cap_add:
      - NET_ADMIN
    cap_drop:
      - ALL

volumes:
  app-data:
  logs:

networks:
  frontend:
  backend:
```

**Minimal Configuration:**

```yaml
version: "3.8"

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
```

**Real-world Example:**

```yaml
version: "3.8"

services:
  # Web Server
  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - static-files:/usr/share/nginx/html:ro
    networks:
      - frontend
    depends_on:
      - api
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--quiet",
          "--tries=1",
          "--spider",
          "http://localhost/health",
        ]
      interval: 30s
      timeout: 5s
      retries: 3

  # API Service
  api:
    build:
      context: ./api
      target: production
    container_name: api
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      REDIS_URL: redis://redis:6379
    env_file:
      - .env.production
    volumes:
      - uploads:/app/uploads
      - logs:/app/logs
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
      resources:
        limits:
          cpus: "2"
          memory: 2G
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  # Database
  postgres:
    image: postgres:15-alpine
    container_name: postgres
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - postgres_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 4G

  # Cache
  redis:
    image: redis:7-alpine
    container_name: redis
    command: redis-server --appendonly yes
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

volumes:
  postgres-data:
  redis-data:
  uploads:
  logs:
  static-files:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
```

---

### 4. How do you use environment variables in Docker Compose?

**Answer:**

**Methods to Define Environment Variables:**

**1. Direct in compose file:**

```yaml
services:
  api:
    image: myapi
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      API_KEY: "abc123"
```

**2. Using env_file:**

```yaml
services:
  api:
    image: myapi
    env_file:
      - .env
      - .env.production
```

**3. From shell environment:**

```yaml
services:
  api:
    image: myapi
    environment:
      DB_PASSWORD: ${DB_PASSWORD}
      API_KEY: ${API_KEY:-default_value}
```

**Complete Example:**

**.env file:**

```bash
# .env
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_NAME=myapp
DB_USER=admin
# DB_PASSWORD set in shell or .env.local
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret
API_PORT=3000
```

**.env.production file:**

```bash
# .env.production
LOG_LEVEL=info
ENABLE_CORS=true
MAX_REQUEST_SIZE=10mb
RATE_LIMIT=100
```

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  api:
    build: ./api
    ports:
      - "${API_PORT}:3000"
    environment:
      # Direct values
      NODE_ENV: production

      # From .env file
      DB_HOST: ${DB_HOST}
      DB_PORT: ${DB_PORT}
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}

      # From shell (must be exported)
      DB_PASSWORD: ${DB_PASSWORD}

      # With default value
      TIMEOUT: ${TIMEOUT:-30}

      # Computed values
      DATABASE_URL: "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

    env_file:
      - .env
      - .env.production

    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

**Usage:**

```bash
# Set in shell
export DB_PASSWORD=secret123

# Or in .env.local (gitignored)
echo "DB_PASSWORD=secret123" > .env.local

# Start with specific env file
docker compose --env-file .env.local up -d

# Override values
API_PORT=8080 docker compose up -d
```

**Environment Variable Precedence:**

```
1. Shell environment variables
2. .env file
3. env_file in compose
4. environment in compose
5. Default values (:-default)
```

**Multiple Environments:**

```yaml
# Base: docker-compose.yml
version: "3.8"

services:
  api:
    build: ./api
    env_file:
      - .env

---
# Development: docker-compose.dev.yml
version: "3.8"

services:
  api:
    environment:
      NODE_ENV: development
      DEBUG: "api:*"
    volumes:
      - ./api:/app

---
# Production: docker-compose.prod.yml
version: "3.8"

services:
  api:
    environment:
      NODE_ENV: production
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
```

**Run with specific configuration:**

```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Best Practices:**

```bash
# .env (committed - defaults)
NODE_ENV=development
DB_HOST=localhost
API_PORT=3000

# .env.local (gitignored - secrets)
DB_PASSWORD=secret123
JWT_SECRET=supersecret
API_KEY=prod_key_123

# .gitignore
.env.local
.env.*.local
```

---

## Compose File Syntax

### 5. Explain Docker Compose file structure and versions

**Answer:**

**Compose File Structure:**

```yaml
version: "3.8" # Compose file version

services: # Container definitions
  service1:
    # Service configuration
  service2:
    # Service configuration

volumes: # Named volumes
  volume1:
  volume2:

networks: # Custom networks
  network1:
  network2:

configs: # Configuration files (Swarm)
  config1:

secrets: # Sensitive data (Swarm)
  secret1:
```

**Version History:**

| Version | Docker Engine | Key Features           |
| ------- | ------------- | ---------------------- |
| 3.8     | 19.03.0+      | Latest features        |
| 3.7     | 18.06.0+      | init, rollback         |
| 3.6     | 18.02.0+      | tmpfs size             |
| 3.5     | 17.12.0+      | isolation mode         |
| 3.4     | 17.09.0+      | target, network labels |
| 3.3     | 17.06.0+      | build labels           |
| 3.0     | 1.13.0+       | Volume, networks       |
| 2.x     | 1.10.0+       | Legacy                 |

**Complete Example:**

```yaml
version: "3.8"

# Service definitions
services:
  # Web service
  web:
    image: nginx:alpine
    container_name: web
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - web-content:/usr/share/nginx/html
    networks:
      - frontend
    depends_on:
      - api
    restart: unless-stopped
    labels:
      com.example.description: "Web server"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost"]
      interval: 30s
      timeout: 3s
      retries: 3

  # API service
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      args:
        NODE_VERSION: 18
      target: production
    image: myapi:latest
    environment:
      NODE_ENV: production
      DB_HOST: postgres
    env_file:
      - .env
    volumes:
      - api-uploads:/app/uploads
    networks:
      - frontend
      - backend
    depends_on:
      postgres:
        condition: service_healthy
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G
        reservations:
          cpus: "1"
          memory: 512M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  # Database service
  postgres:
    image: postgres:15-alpine
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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 4G

# Volume definitions
volumes:
  web-content:
    driver: local
  api-uploads:
    driver: local
  postgres-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/postgres-data

# Network definitions
networks:
  frontend:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
  backend:
    driver: bridge
    internal: true

# Secrets (for Swarm)
secrets:
  db_password:
    file: ./secrets/db_password.txt

# Configs (for Swarm)
configs:
  nginx_config:
    file: ./nginx.conf
```

**Top-level Keys:**

**1. version:**

```yaml
version: "3.8" # Recommended
```

**2. services:**

```yaml
services:
  service_name:
    # Service configuration
```

**3. volumes:**

```yaml
volumes:
  volume_name:
    driver: local
    driver_opts:
      type: nfs
```

**4. networks:**

```yaml
networks:
  network_name:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.28.0.0/16
```

**5. configs:**

```yaml
configs:
  config_name:
    file: ./config-file
    # or external
    external: true
```

**6. secrets:**

```yaml
secrets:
  secret_name:
    file: ./secret-file
    # or external
    external: true
```

---

## Multi-container Applications

### 6. How do you build a multi-container application with Docker Compose?

**Answer:**

**Complete Multi-Container Application:**

**Project Structure:**

```
myapp/
├── docker-compose.yml
├── .env
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── worker/
│   ├── Dockerfile
│   └── worker.py
└── init.sql
```

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  # Load Balancer
  nginx:
    build: ./nginx
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - static-files:/usr/share/nginx/html
    networks:
      - frontend
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  # Frontend (React/Vue/Angular)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NODE_VERSION: 18
    container_name: frontend
    environment:
      REACT_APP_API_URL: http://backend:3000
    volumes:
      - ./frontend/src:/app/src
      - /app/node_modules
    networks:
      - frontend
    depends_on:
      - backend
    restart: unless-stopped

  # Backend API (Node.js/Python/Go)
  backend:
    build: ./backend
    container_name: backend
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: myapp
      DB_USER: admin
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://rabbitmq:5672
    env_file:
      - .env
    volumes:
      - uploads:/app/uploads
      - logs:/app/logs
    networks:
      - frontend
      - backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
      rabbitmq:
        condition: service_started
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Background Worker
  worker:
    build: ./worker
    container_name: worker
    environment:
      DB_HOST: postgres
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://rabbitmq:5672
    networks:
      - backend
    depends_on:
      - postgres
      - redis
      - rabbitmq
    restart: unless-stopped

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: postgres
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis
    command: redis-server --appendonly yes
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

  # RabbitMQ Message Queue
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    ports:
      - "5672:5672"
      - "15672:15672" # Management UI
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Monitoring - Prometheus
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
    ports:
      - "9090:9090"
    networks:
      - monitoring
    restart: unless-stopped

  # Monitoring - Grafana
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"
    networks:
      - monitoring
    depends_on:
      - prometheus
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:
  rabbitmq-data:
  uploads:
  logs:
  static-files:
  prometheus-data:
  grafana-data:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
  monitoring:
    driver: bridge
```

**Communication Flow:**

```
User → Nginx (80/443)
      ↓
Frontend (React/Vue)
      ↓
Backend API (Node.js)
      ↓
├─→ PostgreSQL (Database)
├─→ Redis (Cache)
└─→ RabbitMQ (Queue)
      ↓
Worker (Background Jobs)
      ↓
PostgreSQL + Redis
```

**Network Isolation:**

```
frontend network:
- nginx
- frontend
- backend (also in backend network)

backend network:
- backend
- worker
- postgres
- redis
- rabbitmq

monitoring network:
- prometheus
- grafana
```

**Development Setup:**

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Access services
# Frontend: http://localhost
# Backend API: http://localhost/api
# RabbitMQ Management: http://localhost:15672
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000

# Scale workers
docker compose up -d --scale worker=5

# Restart specific service
docker compose restart backend

# Stop all
docker compose down
```

---

## Environment Management

### 7. How do you manage multiple environments with Docker Compose?

**Answer:**

**Approach 1: Multiple Compose Files**

**Project Structure:**

```
myapp/
├── docker-compose.yml           # Base configuration
├── docker-compose.dev.yml       # Development overrides
├── docker-compose.prod.yml      # Production overrides
├── docker-compose.test.yml      # Testing overrides
├── .env
├── .env.development
├── .env.production
└── .env.test
```

**Base: docker-compose.yml**

```yaml
version: "3.8"

services:
  api:
    build: ./api
    environment:
      DB_HOST: postgres
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:alpine

volumes:
  postgres-data:
```

**Development: docker-compose.dev.yml**

```yaml
version: "3.8"

services:
  api:
    build:
      context: ./api
      target: development
    volumes:
      # Mount source for hot reload
      - ./api/src:/app/src
    environment:
      NODE_ENV: development
      DEBUG: "api:*"
    ports:
      - "3000:3000"
      - "9229:9229" # Debug port
    command: npm run dev

  postgres:
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: dev_password

  redis:
    ports:
      - "6379:6379"
```

**Production: docker-compose.prod.yml**

```yaml
version: "3.8"

services:
  api:
    build:
      context: ./api
      target: production
    image: myapi:${VERSION}
    environment:
      NODE_ENV: production
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 2G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 4G

  redis:
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    restart: unless-stopped
```

**Testing: docker-compose.test.yml**

```yaml
version: "3.8"

services:
  api:
    build:
      context: ./api
      target: test
    environment:
      NODE_ENV: test
      DB_HOST: postgres-test
    command: npm test
    depends_on:
      - postgres-test

  postgres-test:
    image: postgres:15
    environment:
      POSTGRES_DB: test_db
      POSTGRES_PASSWORD: test_password
    tmpfs:
      - /var/lib/postgresql/data
```

**Usage:**

```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Testing
docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm api

# With specific env file
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Approach 2: Environment Variables**

**.env.development:**

```bash
COMPOSE_FILE=docker-compose.yml:docker-compose.dev.yml
COMPOSE_PROJECT_NAME=myapp_dev
NODE_ENV=development
DB_PASSWORD=dev_password
REDIS_PASSWORD=dev_password
LOG_LEVEL=debug
```

**.env.production:**

```bash
COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml
COMPOSE_PROJECT_NAME=myapp_prod
NODE_ENV=production
DB_PASSWORD=secure_prod_password
REDIS_PASSWORD=secure_redis_password
LOG_LEVEL=info
VERSION=1.0.0
```

**Scripts for Easy Switching:**

**scripts/dev.sh:**

```bash
#!/bin/bash
export $(cat .env.development | xargs)
docker compose up
```

**scripts/prod.sh:**

```bash
#!/bin/bash
export $(cat .env.production | xargs)
docker compose up -d
```

**Makefile Approach:**

```makefile
# Makefile

.PHONY: dev prod test clean

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

test:
	docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm api npm test

build-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml build

deploy:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

stop:
	docker compose down

clean:
	docker compose down -v
	docker system prune -f

logs:
	docker compose logs -f

ps:
	docker compose ps
```

**Usage with Makefile:**

```bash
make dev      # Start development
make prod     # Start production
make test     # Run tests
make logs     # View logs
make clean    # Clean everything
```

---

## Orchestration Fundamentals

### 8. What is the difference between Docker Compose and Docker Swarm/Kubernetes?

**Answer:**

| Feature             | Docker Compose | Docker Swarm     | Kubernetes |
| ------------------- | -------------- | ---------------- | ---------- |
| **Scope**           | Single host    | Multi-host       | Multi-host |
| **Complexity**      | Simple         | Medium           | Complex    |
| **Use Case**        | Development    | Small production | Enterprise |
| **Auto-scaling**    | No             | Yes              | Yes        |
| **Load Balancing**  | No             | Yes              | Yes        |
| **Self-healing**    | No             | Yes              | Yes        |
| **Rolling Updates** | No             | Yes              | Yes        |
| **Configuration**   | YAML           | YAML             | YAML       |
| **Learning Curve**  | Easy           | Medium           | Steep      |

**Docker Compose:**

```yaml
# Best for: Development, testing, small deployments
version: "3.8"

services:
  web:
    image: nginx
    ports:
      - "80:80"

  api:
    build: ./api
    depends_on:
      - db

  db:
    image: postgres
# Simple, single-host, no orchestration features
```

**Docker Swarm:**

```yaml
# Best for: Simple multi-host deployments
version: "3.8"

services:
  web:
    image: nginx
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    ports:
      - "80:80"
# Built-in Docker, easier than K8s, less features
```

**Kubernetes:**

```yaml
# Best for: Large-scale, enterprise deployments
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
          image: nginx
          ports:
            - containerPort: 80
# Most features, most complex, industry standard
```

**When to Use:**

**Docker Compose:**

- ✅ Local development
- ✅ CI/CD testing
- ✅ Simple single-host deployments
- ✅ Personal projects
- ❌ Production clusters
- ❌ Auto-scaling needed
- ❌ Multi-host deployments

**Docker Swarm:**

- ✅ Simple multi-host
- ✅ Small to medium production
- ✅ Easy setup
- ✅ Migration from Compose
- ❌ Complex orchestration
- ❌ Large enterprise
- ❌ Advanced features

**Kubernetes:**

- ✅ Large-scale deployments
- ✅ Enterprise production
- ✅ Advanced orchestration
- ✅ Cloud-native apps
- ❌ Simple projects
- ❌ Small teams
- ❌ Quick prototypes

**Migration Example:**

**Compose (Development):**

```yaml
# docker-compose.yml
version: "3.8"

services:
  web:
    image: nginx
    ports:
      - "80:80"
```

**Swarm (Production):**

```yaml
# docker-stack.yml
version: "3.8"

services:
  web:
    image: nginx
    ports:
      - "80:80"
    deploy:
      replicas: 3
      placement:
        constraints:
          - node.role == worker
```

**Deploy to Swarm:**

```bash
# Init swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-stack.yml myapp

# Scale service
docker service scale myapp_web=5

# Update service
docker service update --image nginx:latest myapp_web
```

---

**Continue to:** [05. Advanced Questions →](05-advanced-questions.md)

**Return to:** [Interview Preparation Index →](README.md)




