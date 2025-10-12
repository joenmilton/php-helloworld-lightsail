# Quick Setup Guide

## 1. Push to GitHub
```bash
# Create repository at: https://github.com/new
# Name: php-helloworld-lightsail

git remote add origin https://github.com/YOUR_USERNAME/php-helloworld-lightsail.git
git push -u origin main
```

## 2. Setup GitHub Secrets
- Go to: Repository → Settings → Secrets → Actions
- Add:
  - `LIGHTSAIL_HOST`: Your Lightsail IP
  - `LIGHTSAIL_SSH_KEY`: Your private key content

## 3. Create Lightsail Instance
- AWS Lightsail Console
- Choose "LAMP (PHP 8)" blueprint
- $3.50/month plan

## 4. Auto-Deploy
- Push code → GitHub Actions deploys automatically
- Access: `http://your-lightsail-ip`