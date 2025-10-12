# Lightsail Deployment Process Explained

## What Happens During Deployment

### 1. Lightsail Instance Setup
```
AWS Lightsail → Create Instance → Bitnami LAMP Blueprint
├── Ubuntu Linux (OS)
├── Apache Web Server (pre-configured)
├── MySQL Database (pre-installed)
├── PHP 8.2+ (ready to use)
└── File Structure: /opt/bitnami/apache/htdocs/ (web root)
```

### 2. GitHub Actions Pipeline Trigger
```
You push code → GitHub detects change → Triggers workflow
├── Event: git push to main branch
├── Runner: Ubuntu server (GitHub's)
├── Actions: SSH + SCP commands
└── Target: Your Lightsail instance
```

### 3. Deployment Steps (Automated)
```
Step 1: Connect to Lightsail
├── SSH using your private key
├── Username: bitnami
└── Host: Your Lightsail IP

Step 2: Clear old files
├── cd /opt/bitnami/apache/htdocs/
└── sudo rm -rf * (removes old code)

Step 3: Upload new files
├── SCP copies: *.php, *.json, README.md
├── From: GitHub repository
└── To: /opt/bitnami/apache/htdocs/

Step 4: Set permissions & restart
├── chown bitnami:daemon (file ownership)
└── restart Apache server
```

## File Flow Diagram
```
Your Computer → GitHub → GitHub Actions → Lightsail
     ↓              ↓           ↓              ↓
  git push    →  Repository → SSH/SCP → /opt/bitnami/apache/htdocs/
                                              ↓
                                        Apache serves files
                                              ↓
                                      http://your-ip/
```

## What Makes This Work

**Bitnami LAMP Stack:**
- Pre-configured Apache + PHP + MySQL
- No setup needed - just upload files
- Apache automatically serves PHP files
- MySQL available if needed

**GitHub Actions:**
- Free CI/CD service (2000 minutes/month)
- Runs on every git push
- Executes SSH commands remotely
- No server maintenance needed

**File Structure on Lightsail:**
```
/opt/bitnami/apache/htdocs/
├── index.php (your main file)
├── composer.json (dependencies)
└── README.md (documentation)
```

## Security & Access

**SSH Key Authentication:**
- Private key stored in GitHub Secrets
- Public key on Lightsail instance
- Secure, encrypted connection

**Web Access:**
- Apache serves files from htdocs/
- Direct access: http://your-lightsail-ip/
- No additional configuration needed

## Cost Breakdown
- Lightsail Instance: $3.50/month
- GitHub Actions: Free (2000 min/month)
- Domain (optional): ~$12/year
- SSL Certificate: Free (Let's Encrypt via Bitnami)