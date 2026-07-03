#!/bin/bash
# =========================================================
# Aadidev Properties — App Deployment Script
# Run this AFTER server-setup.sh and MySQL setup
# =========================================================

set -e

echo "=========================================="
echo "  Deploying Aadidev Properties App"
echo "=========================================="

# --- 1. Deploy Frontend ---
echo ""
echo "[1/3] Deploying Angular frontend..."
sudo cp -r /home/ubuntu/frontend-dist/* /var/www/aadidev/
sudo chown -R www-data:www-data /var/www/aadidev
echo "Frontend deployed to /var/www/aadidev"

# --- 2. Deploy Backend ---
echo ""
echo "[2/3] Setting up Spring Boot backend..."
sudo cp /home/ubuntu/Office-0.0.1-SNAPSHOT.jar /opt/aadidev/app.jar

# Create systemd service
sudo tee /etc/systemd/system/aadidev-backend.service > /dev/null <<EOF
[Unit]
Description=Aadidev Properties Backend
After=mysql.service network.target

[Service]
User=ubuntu
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
echo "Backend service started"

# --- 3. Configure Nginx ---
echo ""
echo "[3/3] Configuring Nginx..."
sudo tee /etc/nginx/sites-available/aadidev > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/aadidev;
    index index.html;

    # Gzip compression for faster loading
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;

    # Angular SPA — all routes go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API requests proxy to Spring Boot
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    # File upload size limit
    client_max_body_size 10M;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/aadidev /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
echo "Nginx configured and restarted"

echo ""
echo "=========================================="
echo "  Deployment Complete! 🎉"
echo "=========================================="
echo ""
echo "  Website is live at: http://$(curl -s ifconfig.me)"
echo ""
echo "  Useful commands:"
echo "    sudo systemctl status aadidev-backend  — Check backend"
echo "    sudo systemctl status nginx            — Check nginx"
echo "    sudo systemctl status mysql            — Check MySQL"
echo "    sudo journalctl -u aadidev-backend -f  — Backend logs"
echo ""
