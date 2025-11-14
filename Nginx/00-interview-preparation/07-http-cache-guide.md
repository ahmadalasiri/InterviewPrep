# Using Nginx as HTTP Cache

## Overview

Nginx can cache responses from backend servers, reducing load on backends and improving response times for clients. This guide covers configuring Nginx as an HTTP cache.

## What is HTTP Caching?

HTTP caching stores responses from backend servers so that subsequent requests for the same content can be served directly from cache without hitting the backend.

### Benefits

1. **Reduced Backend Load**: Fewer requests to backend servers
2. **Faster Response Times**: Cached content served instantly
3. **Bandwidth Savings**: Reduced data transfer
4. **Better User Experience**: Faster page loads
5. **Cost Savings**: Less server resources needed

## Basic Caching Configuration

### Define Cache Zone

```nginx
http {
    # Define cache zone
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m 
                     max_size=10g inactive=60m use_temp_path=off;
    
    server {
        location / {
            proxy_pass http://backend;
            
            # Enable caching
            proxy_cache my_cache;
            
            # Cache valid responses
            proxy_cache_valid 200 60m;
            proxy_cache_valid 404 1m;
        }
    }
}
```

### Cache Zone Parameters

- **`/var/cache/nginx`**: Directory where cached files are stored
- **`levels=1:2`**: Directory structure (1 level, 2 sublevels)
- **`keys_zone=my_cache:10m`**: Shared memory zone name and size
- **`max_size=10g`**: Maximum cache size on disk
- **`inactive=60m`**: Remove cached files not accessed for 60 minutes
- **`use_temp_path=off`**: Store temporary files in cache directory

## Complete Caching Configuration

```nginx
http {
    # Cache zone configuration
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=backend_cache:10m 
                     max_size=10g inactive=60m use_temp_path=off;
    
    upstream backend {
        server 127.0.0.1:8080;
    }
    
    server {
        listen 80;
        server_name example.com;
        
        location / {
            proxy_pass http://backend;
            
            # Caching
            proxy_cache backend_cache;
            proxy_cache_valid 200 302 10m;
            proxy_cache_valid 404 1m;
            proxy_cache_valid any 1m;
            
            # Cache key
            proxy_cache_key "$scheme$request_method$host$request_uri";
            
            # Bypass cache conditions
            proxy_cache_bypass $http_pragma $http_authorization;
            proxy_no_cache $http_pragma $http_authorization;
            
            # Headers
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            
            # Add cache status header
            add_header X-Cache-Status $upstream_cache_status;
        }
    }
}
```

## Cache Keys

### Default Cache Key

By default, Nginx uses: `$scheme$proxy_host$request_uri`

### Custom Cache Key

```nginx
location / {
    proxy_pass http://backend;
    proxy_cache my_cache;
    
    # Custom cache key
    proxy_cache_key "$scheme$request_method$host$request_uri$is_args$args";
}
```

### Cache Key Examples

```nginx
# Include query parameters
proxy_cache_key "$scheme$host$request_uri$is_args$args";

# Include headers
proxy_cache_key "$scheme$host$request_uri$http_accept_language";

# Include cookies
proxy_cache_key "$scheme$host$request_uri$cookie_user";
```

## Cache Validity

### Setting Cache Validity Times

```nginx
location / {
    proxy_pass http://backend;
    proxy_cache my_cache;
    
    # Cache different status codes for different times
    proxy_cache_valid 200 302 10m;      # 10 minutes
    proxy_cache_valid 404 1m;          # 1 minute
    proxy_cache_valid 500 502 503 504 0m;  # Don't cache errors
    proxy_cache_valid any 5m;           # Default 5 minutes
}
```

### Cache Validity Based on Headers

Nginx respects backend cache headers:
- **Cache-Control**: `max-age`, `no-cache`, `no-store`
- **Expires**: Expiration date
- **ETag**: Entity tag for validation

## Cache Bypass and No-Cache

### Bypass Cache (Don't Use Cache)

```nginx
location / {
    proxy_pass http://backend;
    proxy_cache my_cache;
    
    # Bypass cache conditions
    proxy_cache_bypass $http_pragma $http_authorization;
    proxy_cache_bypass $cookie_nocache;
    proxy_cache_bypass $arg_nocache;
}
```

### No Cache (Don't Store in Cache)

```nginx
location / {
    proxy_pass http://backend;
    proxy_cache my_cache;
    
    # Don't cache conditions
    proxy_no_cache $http_pragma $http_authorization;
    proxy_no_cache $cookie_nocache;
    proxy_no_cache $arg_nocache;
}
```

### Common Bypass Patterns

```nginx
# Bypass for authenticated users
proxy_cache_bypass $http_authorization;

# Bypass for POST requests
proxy_cache_bypass $request_method;

# Bypass for specific paths
if ($request_uri ~* "/admin|/api/auth") {
    set $no_cache 1;
}
proxy_cache_bypass $no_cache;
```

## Cache Headers

### Cache Status Header

```nginx
location / {
    proxy_pass http://backend;
    proxy_cache my_cache;
    
    # Add cache status header
    add_header X-Cache-Status $upstream_cache_status;
}
```

**Cache Status Values:**
- **MISS**: Not in cache, fetched from backend
- **HIT**: Served from cache
- **BYPASS**: Cache bypassed
- **EXPIRED**: Cache expired, fetched from backend
- **STALE**: Serving stale cache (when `proxy_cache_use_stale` is enabled)
- **UPDATING**: Cache is being updated
- **REVALIDATED**: Cache revalidated with backend

### Cache Control Headers

```nginx
location / {
    proxy_pass http://backend;
    proxy_cache my_cache;
    
    # Hide backend cache headers
    proxy_hide_header Cache-Control;
    proxy_hide_header Expires;
    
    # Add custom cache headers
    add_header Cache-Control "public, max-age=3600";
}
```

## Advanced Caching

### Serving Stale Cache

```nginx
location / {
    proxy_pass http://backend;
    proxy_cache my_cache;
    
    # Serve stale cache on errors
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_background_update on;
    proxy_cache_lock on;
}
```

**Parameters:**
- **error**: Serve stale on errors
- **timeout**: Serve stale on timeouts
- **updating**: Serve stale while updating
- **http_5xx**: Serve stale on specific status codes

### Cache Locking

Prevents multiple requests from updating cache simultaneously.

```nginx
location / {
    proxy_pass http://backend;
    proxy_cache my_cache;
    
    proxy_cache_lock on;              # Enable cache locking
    proxy_cache_lock_timeout 5s;      # Lock timeout
    proxy_cache_lock_age 10s;         # Lock age
}
```

### Background Cache Update

Update cache in background while serving stale content.

```nginx
location / {
    proxy_pass http://backend;
    proxy_cache my_cache;
    
    proxy_cache_background_update on;
    proxy_cache_use_stale updating;
}
```

## Cache Purging

### Manual Cache Purging

```nginx
# Install nginx cache purge module or use map

map $request_method $purge_method {
    PURGE 1;
    default 0;
}

server {
    location / {
        proxy_pass http://backend;
        proxy_cache my_cache;
        
        proxy_cache_purge $purge_method;
    }
}
```

*Note: Requires ngx_cache_purge module*

### Cache Purging with Custom Location

```nginx
location ~ /purge(/.*) {
    proxy_cache_purge my_cache $scheme$request_method$host$1;
}
```

## Multiple Cache Zones

### Different Cache Zones for Different Content

```nginx
http {
    # Static content cache
    proxy_cache_path /var/cache/nginx/static levels=1:2 keys_zone=static_cache:50m 
                     max_size=5g inactive=7d;
    
    # API cache
    proxy_cache_path /var/cache/nginx/api levels=1:2 keys_zone=api_cache:10m 
                     max_size=1g inactive=1h;
    
    server {
        # Static content
        location /static/ {
            proxy_pass http://backend;
            proxy_cache static_cache;
            proxy_cache_valid 200 7d;
        }
        
        # API
        location /api/ {
            proxy_pass http://backend;
            proxy_cache api_cache;
            proxy_cache_valid 200 1h;
        }
    }
}
```

## Cache Optimization

### Cache Warming

Pre-populate cache with important content.

```bash
# Script to warm cache
#!/bin/bash
URLS=(
    "http://example.com/page1"
    "http://example.com/page2"
    "http://example.com/api/endpoint1"
)

for url in "${URLS[@]}"; do
    curl -s "$url" > /dev/null
done
```

### Cache Statistics

Monitor cache effectiveness:

```nginx
log_format cache_log '$remote_addr - $remote_user [$time_local] '
                     '"$request" $status $body_bytes_sent '
                     '"$http_referer" "$http_user_agent" '
                     'cache_status: $upstream_cache_status '
                     'cache_key: $request_uri';

server {
    access_log /var/log/nginx/cache.log cache_log;
}
```

## Best Practices

1. **Set Appropriate Cache Sizes**
   - Balance between memory and disk usage
   - Monitor cache hit rates

2. **Configure Cache Validity**
   - Longer for static content
   - Shorter for dynamic content
   - Don't cache errors

3. **Use Cache Headers**
   - Add cache status headers for debugging
   - Respect backend cache headers

4. **Bypass for Authenticated Content**
   - Don't cache user-specific content
   - Bypass cache for authenticated requests

5. **Monitor Cache Performance**
   - Track cache hit rates
   - Monitor cache size
   - Check for cache misses

6. **Cache Key Design**
   - Include all relevant variables
   - Avoid unnecessary cache key variations

7. **Error Handling**
   - Serve stale cache on errors
   - Don't cache error responses

## Complete Example

```nginx
http {
    # Cache zone
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=main_cache:50m 
                     max_size=10g inactive=60m use_temp_path=off;
    
    # Log format with cache status
    log_format cache_format '$remote_addr - $remote_user [$time_local] '
                           '"$request" $status $body_bytes_sent '
                           '"$http_referer" "$http_user_agent" '
                           'cache: $upstream_cache_status';
    
    upstream backend {
        server 127.0.0.1:8080;
    }
    
    server {
        listen 80;
        server_name example.com;
        
        access_log /var/log/nginx/cache.log cache_format;
        
        # Static content - long cache
        location /static/ {
            proxy_pass http://backend;
            proxy_cache main_cache;
            proxy_cache_valid 200 7d;
            proxy_cache_key "$scheme$host$request_uri";
            add_header X-Cache-Status $upstream_cache_status;
        }
        
        # API - short cache
        location /api/ {
            proxy_pass http://backend;
            proxy_cache main_cache;
            proxy_cache_valid 200 5m;
            proxy_cache_key "$scheme$host$request_uri$is_args$args";
            
            # Bypass for authenticated requests
            proxy_cache_bypass $http_authorization;
            proxy_no_cache $http_authorization;
            
            # Serve stale on errors
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503;
            proxy_cache_background_update on;
            
            add_header X-Cache-Status $upstream_cache_status;
        }
        
        # Dynamic content - no cache
        location /admin/ {
            proxy_pass http://backend;
            proxy_cache_bypass 1;
            proxy_no_cache 1;
        }
    }
}
```

## Troubleshooting

### Cache Not Working

- Check cache zone is defined
- Verify cache directory permissions
- Check cache key configuration
- Review bypass conditions

### Low Cache Hit Rate

- Check cache validity times
- Verify cache keys are consistent
- Review bypass conditions
- Check if content is cacheable

### Cache Size Issues

- Monitor cache directory size
- Adjust `max_size` parameter
- Set appropriate `inactive` time
- Clean old cache files

## Resources

- [Nginx Proxy Cache Module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache)
- [Nginx Cache Guide](https://www.nginx.com/blog/nginx-caching-guide/)

