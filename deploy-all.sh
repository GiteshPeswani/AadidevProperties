#!/bin/bash
# =========================================================
# Aadidev Properties — Complete Deployment Script
# Run this on the Oracle Cloud VM
# Usage: bash deploy-all.sh
# =========================================================

set -e

echo "=========================================="
echo "  Aadidev Properties — Full Deployment"
echo "=========================================="

# --- 1. System Update ---
echo ""
echo "[1/8] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# --- 2. Install Java 21 ---
echo ""
echo "[2/8] Installing Java 21..."
sudo apt install -y openjdk-21-jdk
java -version

# --- 3. Install MySQL ---
echo ""
echo "[3/8] Installing MySQL..."
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# --- 4. Setup MySQL Database ---
echo ""
echo "[4/8] Setting up MySQL database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS aadidevbackend;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'aadidev'@'localhost' IDENTIFIED BY 'AadidevSecure@2024';"
sudo mysql -e "GRANT ALL PRIVILEGES ON aadidevbackend.* TO 'aadidev'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
echo "MySQL database 'aadidevbackend' created with user 'aadidev'"

# --- 5. Install Nginx ---
echo ""
echo "[5/8] Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# --- 6. Firewall (Oracle Cloud Ubuntu uses iptables) ---
echo ""
echo "[6/8] Configuring firewall..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo apt install -y iptables-persistent
sudo netfilter-persistent save

# --- 7. Build Spring Boot Backend ---
echo ""
echo "[7/8] Building Spring Boot backend..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/backend"
chmod +x gradlew
./gradlew clean build -x test
sudo mkdir -p /opt/aadidev
sudo cp build/libs/Office-0.0.1-SNAPSHOT.jar /opt/aadidev/app.jar

# Create systemd service
sudo tee /etc/systemd/system/aadidev-backend.service > /dev/null <<EOF
[Unit]
Description=Aadidev Properties Backend
After=mysql.service network.target

[Service]
User=root
WorkingDirectory=/opt/aadidev
ExecStart=/usr/bin/java -jar /opt/aadidev/app.jar --spring.profiles.active=prod
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl start aadidev-backend
sudo systemctl enable aadidev-backend
echo "Backend deployed and started"

# --- 8. Deploy Frontend + Configure Nginx ---
echo ""
echo "[8/8] Deploying Angular frontend & configuring Nginx..."
sudo mkdir -p /var/www/aadidev
sudo cp -r "$SCRIPT_DIR/frontend/dist/frontend/browser/"* /var/www/aadidev/
sudo chown -R www-data:www-data /var/www/aadidev

# Nginx configuration
sudo tee /etc/nginx/sites-available/aadidev > /dev/null <<'NGINX'
server {
    listen 80;
    server_name _;

    root /var/www/aadidev;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;

    # Angular SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API reverse proxy to Spring Boot
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    # File upload size
    client_max_body_size 10M;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/aadidev /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# --- Done! ---
PUBLIC_IP=$(curl -s ifconfig.me)
echo ""
echo "=========================================="
echo "  🎉 Deployment Complete!"
echo "=========================================="
echo ""
echo "  Website is LIVE at: http://$PUBLIC_IP"
echo ""
echo "  Services Status:"
sudo systemctl is-active aadidev-backend && echo "  ✅ Backend: Running" || echo "  ❌ Backend: Failed"
sudo systemctl is-active nginx && echo "  ✅ Nginx: Running" || echo "  ❌ Nginx: Failed"
sudo systemctl is-active mysql && echo "  ✅ MySQL: Running" || echo "  ❌ MySQL: Failed"
echo ""
echo "  Useful Commands:"
echo "    sudo journalctl -u aadidev-backend -f   — View backend logs"
echo "    sudo systemctl restart aadidev-backend   — Restart backend"
echo "    sudo systemctl restart nginx             — Restart nginx"
echo ""
