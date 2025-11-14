# Nginx Performance Optimization

## Overview

This guide covers performance optimization techniques for Nginx to handle high traffic and improve response times.

## Worker Processes

### Optimal Worker Configuration

```nginx
# Set to number of CPU cores
worker_processes auto;

# Or specify explicitly
worker_processes 4;

# Bind workers to CPU cores (Linux)
worker_cpu_affinity auto;
```

### Worker Connections

```nginx
events {
    # Max connections per worker
    worker_connections 1024;
    
    # Use efficient event method
    use epoll;  # Linux
    # use kqueue;  # BSD/macOS
    
    # Accept multiple connections at once
    multi_accept on;
}
```

**Calculation:**
- Max connections = `worker_processes × worker_connections`
- Example: 4 workers × 1024 = 4,096 connections

## Connection Handling

### Keep-Alive Connections

```nginx
http {
    # Keep connections alive
    keepalive_timeout 65;
    keepalive_requests 100;
    
    # Reset timed out connections
    reset_timedout_connection on;
}
```

### TCP Optimizations

```nginx
http {
    # Efficient file serving
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;
}
```

## Compression

### Enable Gzip Compression

```nginx
http {
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        image/svg+xml;
    gzip_disable "msie6";
}
```

### Brotli Compression (Requires Module)

```nginx
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json;
```

## Caching

### Proxy Caching

```nginx
http {
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m 
                     max_size=10g inactive=60m use_temp_path=off;
    
    server {
        location / {
            proxy_cache my_cache;
            proxy_cache_valid 200 60m;
            proxy_cache_use_stale error timeout updating;
        }
    }
}
```

### Browser Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

## File Serving Optimization

### Sendfile

```nginx
http {
    sendfile on;
    tcp_nopush on;
}
```

### Direct I/O (Linux)

```nginx
location /large-files/ {
    aio on;
    directio 512;
    output_buffers 1 128k;
}
```

## Buffer Sizes

### Request Buffers

```nginx
http {
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    client_max_body_size 10m;
}
```

### Proxy Buffers

```nginx
location / {
    proxy_pass http://backend;
    
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;
    proxy_temp_file_write_size 16k;
}
```

## Upstream Optimization

### Keep-Alive to Backend

```nginx
upstream backend {
    server 127.0.0.1:8080;
    keepalive 32;  # Keep connections to backend
}

server {
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

### Load Balancing

```nginx
upstream backend {
    least_conn;  # Use least connections
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
}
```

## Logging Optimization

### Disable Logging for Static Files

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    access_log off;
    log_not_found off;
}
```

### Async Logging (Nginx Plus)

```nginx
access_log /var/log/nginx/access.log combined buffer=64k flush=5s;
```

### Conditional Logging

```nginx
map $status $loggable {
    ~^[23]  0;  # Don't log 2xx and 3xx
    default 1;
}

server {
    access_log /var/log/nginx/access.log combined if=$loggable;
}
```

## Static File Optimization

### Static File Serving

```nginx
location /static/ {
    alias /var/www/static/;
    
    # Cache headers
    expires 1y;
    add_header Cache-Control "public, immutable";
    
    # Disable logging
    access_log off;
    
    # Open file cache
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
```

### Open File Cache

```nginx
http {
    open_file_cache max=10000 inactive=30s;
    open_file_cache_valid 60s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
```

## Performance Monitoring

### Status Module

```nginx
server {
    listen 8080;
    
    location /nginx_status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        deny all;
    }
}
```

### Performance Logging

```nginx
log_format performance '$remote_addr - $remote_user [$time_local] '
                      '"$request" $status $body_bytes_sent '
                      'rt=$request_time '
                      'uct=$upstream_connect_time '
                      'uht=$upstream_header_time '
                      'urt=$upstream_response_time';

server {
    access_log /var/log/nginx/performance.log performance;
}
```

## Complete Optimized Configuration

```nginx
user nginx;
worker_processes auto;
worker_cpu_affinity auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for" '
                   'rt=$request_time uct=$upstream_connect_time '
                   'uht=$upstream_header_time urt=$upstream_response_time';
    
    access_log /var/log/nginx/access.log main buffer=64k flush=5s;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 100;
    reset_timedout_connection on;
    
    # Buffers
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    client_max_body_size 10m;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss;
    
    # File cache
    open_file_cache max=10000 inactive=30s;
    open_file_cache_valid 60s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # Proxy cache
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=main_cache:50m 
                     max_size=10g inactive=60m use_temp_path=off;
    
    # Upstream
    upstream backend {
        least_conn;
        server 127.0.0.1:8080;
        server 127.0.0.1:8081;
        keepalive 32;
    }
    
    server {
        listen 80;
        server_name example.com;
        root /var/www/html;
        
        # Static files
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        
        # Proxy
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            
            proxy_cache main_cache;
            proxy_cache_valid 200 10m;
        }
    }
}
```

## Performance Testing

### Load Testing Tools

- **ab** (Apache Bench)
- **wrk**
- **JMeter**
- **Locust**

### Benchmarking

```bash
# Test with ab
ab -n 10000 -c 100 http://example.com/

# Test with wrk
wrk -t12 -c400 -d30s http://example.com/
```

## Best Practices

1. **Optimize Workers**: Match CPU cores
2. **Enable Compression**: Reduce bandwidth
3. **Use Caching**: Reduce backend load
4. **Optimize Buffers**: Balance memory and performance
5. **Keep-Alive**: Reuse connections
6. **Monitor Performance**: Track metrics
7. **Disable Unnecessary Logging**: Reduce I/O
8. **Use Sendfile**: Efficient file serving
9. **Open File Cache**: Cache file metadata
10. **Load Balance**: Distribute load evenly

## Resources

- [Nginx Performance Tuning](https://www.nginx.com/blog/tuning-nginx/)
- [Nginx Optimization Guide](https://nginx.org/en/docs/http/ngx_http_core_module.html)

