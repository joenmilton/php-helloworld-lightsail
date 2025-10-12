# Deploy to Amazon Lightsail - Bitnami LAMP

## Deployment Steps

### Step 1: Create Lightsail Instance
1. Go to AWS Lightsail Console
2. Click "Create instance"
3. Choose "Linux/Unix" platform
4. Select "LAMP (PHP 8)" blueprint by Bitnami
5. Choose instance plan ($3.50/month minimum)
6. Create instance

### Step 2: Deploy Your Code
```bash
# Upload files via SCP
scp -i your-key.pem -r . bitnami@your-instance-ip:/opt/bitnami/apache/htdocs/

# Or use SFTP client like FileZilla
# Host: your-instance-ip
# Username: bitnami
# Key file: your-lightsail-key.pem
```

### Step 3: Access Application
- URL: `http://your-instance-ip`
- Default Bitnami path: `/opt/bitnami/apache/htdocs/`



## Quick Setup Commands

### After Lightsail Instance Creation:
```bash
# Connect to instance
ssh -i your-key.pem bitnami@your-instance-ip

# Navigate to web directory
cd /opt/bitnami/apache/htdocs/

# Remove default files
sudo rm -rf *

# Upload your PHP files here
```