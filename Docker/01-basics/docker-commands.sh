#!/bin/bash
# Basic Docker Commands Reference

# ================================
# IMAGE COMMANDS
# ================================

# List images
docker images
docker image ls

# Pull image
docker pull nginx:latest
docker pull node:18-alpine

# Build image
docker build -t myapp:1.0 .
docker build -t myapp:latest -f Dockerfile.prod .

# Tag image
docker tag myapp:1.0 username/myapp:1.0

# Push image
docker push username/myapp:1.0

# Remove image
docker rmi myapp:1.0
docker image rm myapp:1.0

# Remove all unused images
docker image prune -a


# ================================
# CONTAINER COMMANDS
# ================================

# Run container
docker run nginx
docker run -d nginx                              # Detached
docker run -it ubuntu bash                       # Interactive
docker run --name mycontainer nginx             # Named
docker run -p 8080:80 nginx                     # Port mapping
docker run -v /host/path:/container/path nginx  # Volume mount
docker run -e ENV_VAR=value nginx               # Environment variable

# List containers
docker ps                    # Running containers
docker ps -a                 # All containers
docker ps -q                 # Only IDs

# Start/Stop containers
docker start mycontainer
docker stop mycontainer
docker restart mycontainer

# Pause/Unpause
docker pause mycontainer
docker unpause mycontainer

# Remove container
docker rm mycontainer
docker rm -f mycontainer     # Force remove running container

# Remove all stopped containers
docker container prune


# ================================
# CONTAINER INTERACTION
# ================================

# View logs
docker logs mycontainer
docker logs -f mycontainer          # Follow logs
docker logs --tail 100 mycontainer  # Last 100 lines
docker logs --since 1h mycontainer  # Last hour

# Execute command in container
docker exec mycontainer ls -la
docker exec -it mycontainer bash    # Interactive shell
docker exec -u root mycontainer command  # As specific user

# Copy files
docker cp mycontainer:/path/file.txt ./local/
docker cp ./local/file.txt mycontainer:/path/

# View processes
docker top mycontainer

# View stats
docker stats mycontainer
docker stats --no-stream    # One-time stats

# Inspect container
docker inspect mycontainer


# ================================
# VOLUME COMMANDS
# ================================

# Create volume
docker volume create myvolume

# List volumes
docker volume ls

# Inspect volume
docker volume inspect myvolume

# Remove volume
docker volume rm myvolume

# Remove all unused volumes
docker volume prune


# ================================
# NETWORK COMMANDS
# ================================

# List networks
docker network ls

# Create network
docker network create mynetwork

# Inspect network
docker network inspect mynetwork

# Connect container to network
docker network connect mynetwork mycontainer

# Disconnect container from network
docker network disconnect mynetwork mycontainer

# Remove network
docker network rm mynetwork

# Remove all unused networks
docker network prune


# ================================
# SYSTEM COMMANDS
# ================================

# Show Docker version
docker --version
docker version

# Show Docker system info
docker info

# Show disk usage
docker system df
docker system df -v     # Verbose

# Clean up everything
docker system prune
docker system prune -a  # Include unused images
docker system prune -a --volumes  # Include volumes

# Show Docker events
docker events
docker events --filter event=start


# ================================
# USEFUL COMBINATIONS
# ================================

# Stop all containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Get container IP
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mycontainer

# Get container port mapping
docker port mycontainer

# Follow logs of multiple containers
docker logs -f container1 & docker logs -f container2

# Export container
docker export mycontainer > container.tar

# Import container
docker import container.tar myimage:latest

# Save image
docker save myimage > image.tar

# Load image
docker load < image.tar


# ================================
# HEALTH CHECKS
# ================================

# Check container health
docker inspect --format='{{.State.Health.Status}}' mycontainer

# View health check history
docker inspect --format='{{json .State.Health}}' mycontainer | jq


# ================================
# DEBUGGING COMMANDS
# ================================

# View changes in container filesystem
docker diff mycontainer

# Show container processes
docker top mycontainer

# Show running processes (aux format)
docker exec mycontainer ps aux

# Check port binding
netstat -tulpn | grep docker

# Attach to running container
docker attach mycontainer
# Detach: Ctrl+P, Ctrl+Q

# Run command without starting dependencies
docker run --rm --entrypoint sh myimage

# Check why container exited
docker ps -a
docker inspect mycontainer | grep -A 10 State





