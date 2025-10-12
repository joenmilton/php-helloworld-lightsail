#!/bin/bash

# Lightsail Bitnami LAMP Setup Script
# Run this after connecting to your Lightsail instance

echo "Setting up PHP application on Bitnami LAMP..."

# Navigate to web directory
cd /opt/bitnami/apache/htdocs/

# Backup existing files
sudo mkdir -p /tmp/backup
sudo mv * /tmp/backup/ 2>/dev/null || true

# Set proper permissions for upload
sudo chown -R bitnami:daemon /opt/bitnami/apache/htdocs/
sudo chmod -R 775 /opt/bitnami/apache/htdocs/

echo "Ready to upload your PHP files to: /opt/bitnami/apache/htdocs/"
echo "Use SCP: scp -i your-key.pem -r . bitnami@$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):/opt/bitnami/apache/htdocs/"

# Restart Apache after file upload
echo "After uploading files, restart Apache:"
echo "sudo /opt/bitnami/ctlscript.sh restart apache"