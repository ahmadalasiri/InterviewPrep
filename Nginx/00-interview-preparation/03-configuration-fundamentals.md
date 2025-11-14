# Nginx Configuration Fundamentals

## Configuration File Structure

Nginx uses a hierarchical, context-based configuration system. The main configuration file is typically located at `/etc/nginx/nginx.conf`.

### Configuration Hierarchy

```
Main Context (nginx.conf)
├── events { }
├── http { }
│   ├── server { }          # Virtual host
│   │   └── location { }    # URL matching
│   └── upstream { }        # Backend servers
└── mail { }                # Mail proxy (optional)
```

## Main Configuration File

### Basic Structure

```nginx
# Main context - top level
user nginx;                    # User running worker processes
worker_processes auto;         # Number of worker processes
error_log /var/log/nginx/error.log warn;  # Error log location and level
pid /var/run/nginx.pid;        # PID file location

# Events context
events {
    worker_connections 1024;   # Connections per worker
    use epoll;                 # Event method (Linux)
}

# HTTP context
http {
    # HTTP-level directives
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json;
    
    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

## Contexts

### 1. Main Context
Top-level context containing global directives.

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /var/run/nginx.pid;
```

### 2. Events Context
Configures connection processing.

```nginx
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}
```

### 3. HTTP Context
Contains HTTP server configuration.

```nginx
http {
    # HTTP-level directives
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Server blocks go here
    server {
        # ...
    }
}
```

### 4. Server Context
Defines a virtual host.

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/html;
    index index.html;
    
    location / {
        # ...
    }
}
```

### 5. Location Context
Matches specific URIs.

```nginx
location / {
    try_files $uri $uri/ =404;
}

location /api/ {
    proxy_pass http://backend;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
}
```

### 6. Upstream Context
Defines backend server groups.

```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

## Directives

### Directive Types

1. **Simple Directives**: Single value
   ```nginx
   worker_processes 4;
   listen 80;
   ```

2. **Block Directives**: Contain other directives
   ```nginx
   server {
       listen 80;
   }
   ```

### Common Directives

#### Main Context Directives

```nginx
user nginx;                    # User for worker processes
worker_processes auto;         # Number of workers (auto = CPU cores)
error_log /var/log/nginx/error.log warn;  # Error logging
pid /var/run/nginx.pid;        # PID file
```

#### Events Context Directives

```nginx
events {
    worker_connections 1024;   # Max connections per worker
    use epoll;                 # Event method (Linux)
    multi_accept on;           # Accept multiple connections at once
}
```

#### HTTP Context Directives

```nginx
http {
    include /etc/nginx/mime.types;      # MIME types
    default_type application/octet-stream;
    
    log_format main '...';              # Custom log format
    access_log /var/log/nginx/access.log main;
    
    sendfile on;                        # Efficient file serving
    tcp_nopush on;                      # TCP optimization
    keepalive_timeout 65;               # Keep-alive timeout
    
    gzip on;                            # Enable compression
    gzip_types text/plain text/css;     # Compress these types
}
```

#### Server Context Directives

```nginx
server {
    listen 80;                          # Listen on port 80
    listen [::]:80;                     # IPv6
    server_name example.com www.example.com;  # Server names
    root /var/www/html;                 # Document root
    index index.html index.htm;         # Default files
    
    charset utf-8;                      # Character encoding
    
    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
```

#### Location Context Directives

```nginx
location / {
    root /var/www/html;
    index index.html;
    try_files $uri $uri/ =404;
}

location /static/ {
    alias /var/www/static/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}

location /api/ {
    proxy_pass http://backend;
    proxy_set_header Host $host;
}
```

## Location Block Matching

### Matching Types

1. **Prefix Match** (default)
   ```nginx
   location /images/ {
       # Matches /images/ and anything starting with /images/
   }
   ```

2. **Exact Match** (=)
   ```nginx
   location = /exact {
       # Matches only /exact exactly
   }
   ```

3. **Regex Match** (~)
   ```nginx
   location ~ \.php$ {
       # Case-sensitive regex match for .php files
   }
   ```

4. **Case-Insensitive Regex** (~*)
   ```nginx
   location ~* \.(jpg|jpeg|png|gif)$ {
       # Case-insensitive match for image files
   }
   ```

5. **Longest Prefix Match** (^~)
   ```nginx
   location ^~ /static/ {
       # Stops regex matching, longest prefix wins
   }
   ```

### Matching Priority

1. Exact match (`=`)
2. Longest prefix match (`^~`)
3. Regex match (`~` or `~*`)
4. Prefix match (longest first)

## Variables

### Built-in Variables

```nginx
$host                  # Host header
$request_uri           # Full request URI
$uri                   # Request URI without arguments
$args                  # Query string
$remote_addr           # Client IP address
$remote_user           # Authenticated user
$request_method        # HTTP method (GET, POST, etc.)
$status                # Response status code
$body_bytes_sent       # Bytes sent to client
$http_user_agent      # User agent header
$http_referer          # Referer header
```

### Using Variables

```nginx
location / {
    set $backend "http://backend";
    proxy_pass $backend;
    
    # Log custom variable
    access_log /var/log/nginx/access.log;
    log_format custom '$remote_addr - $request_uri - $status';
}
```

## Includes

### Including Files

```nginx
# Include other configuration files
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;

# Include in server block
server {
    include /etc/nginx/snippets/ssl-params.conf;
}
```

### Common Include Patterns

```nginx
# MIME types
include /etc/nginx/mime.types;

# SSL configuration
include /etc/nginx/snippets/ssl-params.conf;

# Security headers
include /etc/nginx/snippets/security-headers.conf;

# Site configurations
include /etc/nginx/sites-enabled/*;
```

## Comments

```nginx
# Single-line comment

# Multi-line comments
# are done with multiple
# hash symbols

# Block comments don't exist in Nginx
```

## Conditional Logic

### If Directive (Use Sparingly)

```nginx
location / {
    if ($request_method = POST) {
        return 405;
    }
    
    if ($host != 'example.com') {
        return 444;  # Close connection
    }
}
```

⚠️ **Warning**: The `if` directive can be problematic. Use it carefully and prefer other methods when possible.

### Map Directive (Better Alternative)

```nginx
map $http_user_agent $is_mobile {
    default 0;
    ~*mobile 1;
}

server {
    if ($is_mobile) {
        root /var/www/mobile;
    }
}
```

## Best Practices

### 1. Organization

```nginx
# Main config
/etc/nginx/nginx.conf

# Additional configs
/etc/nginx/conf.d/*.conf

# Site configs
/etc/nginx/sites-available/example.com
/etc/nginx/sites-enabled/example.com  # Symlink

# Reusable snippets
/etc/nginx/snippets/ssl-params.conf
/etc/nginx/snippets/security-headers.conf
```

### 2. Comments

```nginx
# Always comment your configuration
server {
    # This server block handles example.com
    listen 80;
    server_name example.com;
    
    # Serve static files
    location /static/ {
        alias /var/www/static/;
    }
}
```

### 3. Testing

```bash
# Always test before reloading
sudo nginx -t

# View full configuration
sudo nginx -T
```

### 4. Security

```nginx
# Hide Nginx version
server_tokens off;

# Don't expose server information
more_set_headers "Server: WebServer";
```

### 5. Performance

```nginx
# Enable sendfile
sendfile on;

# Enable compression
gzip on;
gzip_types text/plain text/css application/json;

# Set appropriate timeouts
keepalive_timeout 65;
```

## Common Configuration Patterns

### Basic Web Server

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Reverse Proxy

```nginx
upstream backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Multiple Server Blocks

```nginx
# HTTP server
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        root /var/www/html;
    }
}
```

## Troubleshooting

### Configuration Testing

```bash
# Test syntax
sudo nginx -t

# Test and show configuration
sudo nginx -T

# Check specific file
sudo nginx -t -c /path/to/nginx.conf
```

### Common Errors

1. **Missing semicolon**
   ```
   nginx: [emerg] unexpected end of file
   ```

2. **Invalid directive in context**
   ```
   nginx: [emerg] "proxy_pass" directive is not allowed here
   ```

3. **File not found**
   ```
   nginx: [emerg] open() "/path/to/file" failed
   ```

### Debugging

```nginx
# Enable debug logging
error_log /var/log/nginx/error.log debug;

# Check error log
sudo tail -f /var/log/nginx/error.log
```

## Resources

- [Nginx Configuration Guide](https://nginx.org/en/docs/http/ngx_http_core_module.html)
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Nginx Directives Reference](https://nginx.org/en/docs/dirindex.html)

