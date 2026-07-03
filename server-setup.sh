#!/bin/bash
# =========================================================
# Aadidev Properties — Oracle Cloud Deployment Script
# Run this on the Oracle Cloud VM after initial setup
# =========================================================

set -e

echo "=========================================="
echo "  Aadidev Properties — Server Setup"
echo "=========================================="

# --- 1. System Update ---
echo ""
echo "[1/6] Updating system..."
sudo apt update && sudo apt upgrade -y

# --- 2. Install Java 21 ---
echo ""
echo "[2/6] Installing Java 21..."
sudo apt install -y openjdk-21-jdk
java -version

# --- 3. Install MySQL ---
echo ""
echo "[3/6] Installing MySQL..."
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

echo ""
echo ">>> MySQL installed. Now run these commands manually:"
echo "    sudo mysql"
echo "    CREATE DATABASE aadidevbackend;"
echo "    CREATE USER 'aadidev'@'localhost' IDENTIFIED BY 'AadidevSecure@2024';"
echo "    GRANT ALL PRIVILEGES ON aadidevbackend.* TO 'aadidev'@'localhost';"
echo "    FLUSH PRIVILEGES;"
echo "    EXIT;"
echo ""

# --- 4. Install Nginx ---
echo ""
echo "[4/6] Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# --- 5. Setup Firewall (iptables for Oracle Cloud Ubuntu) ---
echo ""
echo "[5/6] Configuring firewall..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save

# --- 6. Create directories ---
echo ""
echo "[6/6] Creating directories..."
sudo mkdir -p /var/www/aadidev
sudo mkdir -p /opt/aadidev

echo ""
echo "=========================================="
echo "  Setup Complete! Next steps:"
echo "=========================================="
echo ""
echo "  1. Setup MySQL database (commands above)"
echo "  2. Upload JAR file:  scp backend.jar ubuntu@server:/opt/aadidev/"
echo "  3. Upload frontend:  scp -r dist/* ubuntu@server:/var/www/aadidev/"
echo "  4. Run: bash deploy-app.sh"
echo ""
