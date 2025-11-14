# Nginx Installation & Setup

## Installation Methods

### Ubuntu/Debian

#### Using Package Manager (Recommended)

```bash
# Update package list
sudo apt update

# Install Nginx
sudo apt install nginx

# Verify installation
nginx -v

# Check status
sudo systemctl status nginx
```

#### From Official Repository

```bash
# Install prerequisites
sudo apt install curl gnupg2 ca-certificates lsb-release

# Add Nginx official repository
echo "deb http://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" | sudo tee /etc/apt/sources.list.d/nginx.list

# Import repository signing key
curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -

# Update and install
sudo apt update
sudo apt install nginx
```

### CentOS/RHEL

#### Using YUM/DNF

```bash
# Install EPEL repository (for CentOS/RHEL 7)
sudo yum install epel-release

# Install Nginx
sudo yum install nginx

# For CentOS/RHEL 8+
sudo dnf install nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### From Official Repository

```bash
# Create repository file
sudo vi /etc/yum.repos.d/nginx.repo

# Add the following content:
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=0
enabled=1

# Install Nginx
sudo yum install nginx
```

### macOS

#### Using Homebrew

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Nginx
brew install nginx

# Start Nginx
brew services start nginx
```

### Windows

#### Using Chocolatey

```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Nginx
choco install nginx

# Start Nginx
nginx
```

#### Manual Installation

1. Download Nginx for Windows from [nginx.org](https://nginx.org/en/download.html)
2. Extract to a directory (e.g., `C:\nginx`)
3. Run `nginx.exe` from command prompt

### Docker

#### Using Docker Image

```bash
# Pull official Nginx image
docker pull nginx

# Run Nginx container
docker run -d -p 80:80 --name nginx-server nginx

# Run with custom configuration
docker run -d -p 80:80 -v /path/to/nginx.conf:/etc/nginx/nginx.conf:ro nginx

# Run with custom HTML directory
docker run -d -p 80:80 -v /path/to/html:/usr/share/nginx/html:ro nginx
```

#### Using Docker Compose

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./html:/usr/share/nginx/html:ro
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
```

## Post-Installation Setup

### 1. Verify Installation

```bash
# Check Nginx version
nginx -v

# Check configuration syntax
sudo nginx -t

# Check running processes
ps aux | grep nginx

# Check listening ports
sudo netstat -tlnp | grep nginx
# or
sudo ss -tlnp | grep nginx
```

### 2. Firewall Configuration

#### Ubuntu/Debian (UFW)

```bash
# Allow HTTP traffic
sudo ufw allow 'Nginx Full'
# or separately
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'

# Check status
sudo ufw status
```

#### CentOS/RHEL (firewalld)

```bash
# Allow HTTP and HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Check status
sudo firewall-cmd --list-services
```

### 3. Service Management

#### Systemd Commands

```bash
# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx
sudo systemctl restart nginx

# Reload configuration (graceful)
sudo systemctl reload nginx

# Enable on boot
sudo systemctl enable nginx

# Disable on boot
sudo systemctl disable nginx

# Check status
sudo systemctl status nginx

# View logs
sudo journalctl -u nginx
```

#### Nginx Signals

```bash
# Reload configuration (graceful)
sudo nginx -s reload

# Stop Nginx (graceful)
sudo nginx -s quit

# Stop Nginx (immediate)
sudo nginx -s stop

# Reopen log files
sudo nginx -s reopen
```

### 4. Directory Structure

#### Standard Locations (Linux)

```
/etc/nginx/                    # Main configuration directory
├── nginx.conf                 # Main configuration file
├── conf.d/                    # Additional configuration files
├── sites-available/           # Available site configurations
├── sites-enabled/             # Enabled sites (symlinks)
└── snippets/                  # Reusable configuration snippets

/var/log/nginx/                # Log files
├── access.log                 # Access log
└── error.log                  # Error log

/usr/share/nginx/html/         # Default web root
/var/www/html/                 # Alternative web root (some distros)

/etc/nginx/mime.types          # MIME types configuration
```

### 5. Initial Configuration Test

```bash
# Test configuration syntax
sudo nginx -t

# Test and show full configuration
sudo nginx -T

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 6. Default Configuration

After installation, Nginx comes with a default configuration. Test it:

```bash
# Start Nginx
sudo systemctl start nginx

# Test default page
curl http://localhost

# Or open in browser
# http://localhost or http://your-server-ip
```

## Configuration Files

### Main Configuration File

Location: `/etc/nginx/nginx.conf`

Key sections:
- `user`: User that runs worker processes
- `worker_processes`: Number of worker processes
- `events`: Event processing configuration
- `http`: HTTP server configuration
- `include`: Include other configuration files

### Default Server Block

Usually located in `/etc/nginx/sites-available/default` or `/etc/nginx/conf.d/default.conf`

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80
sudo netstat -tlnp | grep :80

# Kill the process or change Nginx port
```

#### 2. Permission Denied

```bash
# Check Nginx user
grep user /etc/nginx/nginx.conf

# Ensure web root has correct permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

#### 3. Configuration Errors

```bash
# Test configuration
sudo nginx -t

# Check error log
sudo tail -f /var/log/nginx/error.log

# Common errors:
# - Missing semicolons
# - Incorrect file paths
# - Invalid directives
```

#### 4. SELinux Issues (CentOS/RHEL)

```bash
# Check SELinux status
getenforce

# If enforcing, allow HTTP
sudo setsebool -P httpd_can_network_connect 1
sudo setsebool -P httpd_can_network_relay 1
```

## Next Steps

After installation:

1. ✅ Verify Nginx is running
2. ✅ Test default configuration
3. ✅ Configure firewall rules
4. ✅ Review default server block
5. ✅ Set up your first custom server block
6. ✅ Configure SSL/TLS certificates
7. ✅ Set up logging and monitoring

## Verification Checklist

- [ ] Nginx installed successfully
- [ ] Nginx service is running
- [ ] Configuration syntax is valid
- [ ] Default page is accessible
- [ ] Firewall rules configured
- [ ] Logs are being written
- [ ] Service starts on boot (if desired)

## Resources

- [Official Nginx Installation Guide](https://nginx.org/en/linux_packages.html)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [DigitalOcean Nginx Setup](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)

