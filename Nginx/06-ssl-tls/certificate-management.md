# Certificate Management

## Let's Encrypt with Certbot

### Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### Obtain Certificate

```bash
# Automatic configuration
sudo certbot --nginx -d example.com -d www.example.com

# Manual certificate only
sudo certbot certonly --nginx -d example.com -d www.example.com
```

### Auto-Renewal

Certbot automatically sets up renewal. Test renewal:

```bash
sudo certbot renew --dry-run
```

### Manual Renewal

```bash
sudo certbot renew
sudo systemctl reload nginx
```

## Self-Signed Certificate

### Generate Self-Signed Certificate

```bash
# Create directory
sudo mkdir -p /etc/nginx/ssl

# Generate private key
sudo openssl genrsa -out /etc/nginx/ssl/key.pem 2048

# Generate certificate
sudo openssl req -new -x509 -key /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem -days 365

# Set permissions
sudo chmod 600 /etc/nginx/ssl/key.pem
sudo chmod 644 /etc/nginx/ssl/cert.pem
```

## Certificate Files

- **Private Key**: `key.pem` - Keep secure, never share
- **Certificate**: `cert.pem` - Public certificate
- **Chain**: `chain.pem` - Intermediate certificates
- **Full Chain**: `fullchain.pem` - Certificate + chain

## Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_trusted_certificate /etc/nginx/ssl/chain.pem;
}
```

## Certificate Locations (Let's Encrypt)

- Certificates: `/etc/letsencrypt/live/example.com/`
- Private Key: `/etc/letsencrypt/live/example.com/privkey.pem`
- Certificate: `/etc/letsencrypt/live/example.com/cert.pem`
- Full Chain: `/etc/letsencrypt/live/example.com/fullchain.pem`
- Chain: `/etc/letsencrypt/live/example.com/chain.pem`

