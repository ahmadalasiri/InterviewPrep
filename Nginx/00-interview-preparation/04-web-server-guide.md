# Using Nginx as a Web Server

## Overview

Nginx excels at serving static content and can also serve dynamic content through FastCGI, uWSGI, or other protocols. This guide covers configuring Nginx as a web server.

## Basic Web Server Configuration

### Minimal Configuration

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

### Explanation

- `listen 80`: Listen on port 80 (HTTP)
- `server_name`: Domain name(s) this server block handles
- `root`: Document root directory
- `index`: Default files to serve for directory requests
- `location /`: Matches all requests
- `try_files`: Try to serve the requested file, then directory, then 404

## Serving Static Files

### Basic Static File Serving

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/example.com;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Optimized Static File Serving

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/example.com;
    index index.html;
    
    # Enable sendfile for efficient file serving
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

## Virtual Hosts (Server Blocks)

### Multiple Websites on One Server

```nginx
# Website 1
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/example.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# Website 2
server {
    listen 80;
    server_name another.com;
    root /var/www/another.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# Default server (catches unmatched domains)
server {
    listen 80 default_server;
    server_name _;
    return 444;  # Close connection
}
```

### Separate Configuration Files

**File: `/etc/nginx/sites-available/example.com`**

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/example.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

**Enable the site:**

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## Directory Indexing

### Enable Directory Listing

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/example.com;
    
    location / {
        autoindex on;              # Enable directory listing
        autoindex_exact_size off;  # Show human-readable sizes
        autoindex_localtime on;    # Show local time
    }
}
```

### Custom Directory Index Page

```nginx
location / {
    autoindex on;
    autoindex_format html;  # or xml, json, jsonp
}
```

## Access Control

### IP-Based Access Control

```nginx
# Allow specific IPs
location /admin/ {
    allow 192.168.1.100;
    allow 10.0.0.0/8;
    deny all;
}

# Deny specific IPs
location / {
    deny 192.168.1.50;
    allow all;
}
```

### HTTP Basic Authentication

**1. Create password file:**

```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd username
```

**2. Configure Nginx:**

```nginx
location /private/ {
    auth_basic "Restricted Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

### Combined Access Control

```nginx
location /secure/ {
    # IP whitelist
    allow 192.168.1.0/24;
    deny all;
    
    # HTTP authentication
    auth_basic "Secure Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

## MIME Types

### Default MIME Types

```nginx
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
}
```

### Custom MIME Types

```nginx
http {
    include /etc/nginx/mime.types;
    
    # Add custom MIME types
    types {
        application/javascript js;
        text/css css;
        image/svg+xml svg;
    }
}
```

## Error Pages

### Custom Error Pages

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/example.com;
    
    # Custom 404 page
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
    
    # Custom 50x pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        internal;
    }
}
```

### Error Page with Status Code

```nginx
error_page 404 =200 /index.html;  # Return 200 with custom page
```

## URL Rewriting

### Basic Rewrite

```nginx
location / {
    rewrite ^/old-page$ /new-page permanent;  # 301 redirect
    rewrite ^/old-page$ /new-page redirect;   # 302 redirect
}
```

### Rewrite Rules

```nginx
# Remove trailing slash
location / {
    rewrite ^/(.*)/$ /$1 permanent;
}

# Force HTTPS
if ($scheme != "https") {
    return 301 https://$server_name$request_uri;
}
```

## Serving Different File Types

### Images

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
    root /var/www/example.com/images;
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

### CSS and JavaScript

```nginx
location ~* \.(css|js)$ {
    root /var/www/example.com/assets;
    expires 1y;
    add_header Cache-Control "public, immutable";
    gzip_static on;
}
```

### Fonts

```nginx
location ~* \.(woff|woff2|ttf|eot)$ {
    root /var/www/example.com/fonts;
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin *;
}
```

## Performance Optimization

### Enable Compression

```nginx
http {
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;
    gzip_disable "msie6";
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

### Disable Logging for Static Files

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    access_log off;
    log_not_found off;
}
```

## Security Headers

```nginx
server {
    listen 80;
    server_name example.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    location / {
        root /var/www/example.com;
    }
}
```

## Complete Example

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html index.htm;
    
    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Main location
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Static assets with caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Custom error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

## Best Practices

1. **Use separate server blocks** for each domain
2. **Enable compression** for text-based files
3. **Set appropriate cache headers** for static assets
4. **Disable directory indexing** unless needed
5. **Use security headers** to protect your site
6. **Organize files** in logical directory structures
7. **Monitor access logs** for unusual activity
8. **Keep Nginx updated** for security patches

## Troubleshooting

### File Not Found

```bash
# Check file permissions
ls -la /var/www/example.com

# Check Nginx user
grep user /etc/nginx/nginx.conf

# Fix permissions
sudo chown -R www-data:www-data /var/www/example.com
sudo chmod -R 755 /var/www/example.com
```

### 403 Forbidden

- Check file permissions
- Check directory permissions
- Check SELinux (if enabled)
- Verify root path is correct

### Check Configuration

```bash
# Test configuration
sudo nginx -t

# Check error log
sudo tail -f /var/log/nginx/error.log
```

