# GitHub Environment Setup

## Step 1: Create Environment
1. Go to your GitHub repository
2. Navigate to: **Settings** → **Environments**
3. Click **New environment**
4. Name: `production`
5. Click **Configure environment**

## Step 2: Add Environment Secrets
In the `production` environment:

**Add these secrets:**
- `LIGHTSAIL_HOST` - Your Lightsail IP address
- `LIGHTSAIL_SSH_KEY` - Your private key content (.pem file)

## Step 3: Environment Protection (Optional)
- **Required reviewers**: Add team members who must approve deployments
- **Wait timer**: Add delay before deployment
- **Deployment branches**: Restrict to `main` branch only

## Benefits of Using Environments:
- ✅ **Better security** - Secrets scoped to specific environment
- ✅ **Deployment protection** - Require approvals for production
- ✅ **Multiple environments** - dev, staging, production
- ✅ **Deployment history** - Track what was deployed when

## Environment Structure:
```
Repository
├── Environments
│   ├── production (your Lightsail)
│   │   ├── LIGHTSAIL_HOST
│   │   └── LIGHTSAIL_SSH_KEY
│   ├── staging (optional)
│   └── development (optional)
```

## Workflow Configuration:
Your workflow now uses:
```yaml
jobs:
  deploy:
    environment: production  # This line added
```

This ensures secrets come from the `production` environment only.