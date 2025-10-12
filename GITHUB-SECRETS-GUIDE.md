# GitHub Secrets & Variables Setup

## Required Secrets (Minimum)
```
Repository → Settings → Secrets and variables → Actions → Secrets
```

**LIGHTSAIL_HOST** (Secret)
- Value: Your Lightsail IP (e.g., 54.123.45.67)
- Why Secret: Could expose server location

**LIGHTSAIL_SSH_KEY** (Secret)  
- Value: Entire private key content (.pem file)
- Why Secret: Security - never expose private keys

## Optional Variables (Public)
```
Repository → Settings → Secrets and variables → Actions → Variables
```

**DEPLOYMENT_PATH** (Variable)
- Value: `/opt/bitnami/apache/htdocs/`
- Why Variable: Non-sensitive, can be public

**USERNAME** (Variable)
- Value: `bitnami`
- Why Variable: Standard username, not sensitive

**FILES_TO_DEPLOY** (Variable)
- Value: `*.php,*.json,README.md`
- Why Variable: Deployment configuration

## Enhanced Pipeline Example
```yaml
- name: Copy files via SCP
  uses: appleboy/scp-action@v0.1.4
  with:
    host: ${{ secrets.LIGHTSAIL_HOST }}
    username: ${{ vars.USERNAME }}
    key: ${{ secrets.LIGHTSAIL_SSH_KEY }}
    source: ${{ vars.FILES_TO_DEPLOY }}
    target: ${{ vars.DEPLOYMENT_PATH }}
```

## Secrets vs Variables Decision

**Use Secrets for:**
- IP addresses (could expose location)
- SSH keys (security critical)
- Database passwords
- API tokens

**Use Variables for:**
- Usernames (if standard)
- File paths
- Deployment configurations
- Non-sensitive settings

## Current Setup (Minimal)
Your current pipeline works with just 2 secrets:
- ✅ `LIGHTSAIL_HOST`
- ✅ `LIGHTSAIL_SSH_KEY`

No variables needed for basic deployment!