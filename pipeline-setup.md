# Free CI/CD Pipeline Setup for Lightsail

## GitHub Actions (Recommended - Free)

### Setup Steps:

1. **Push code to GitHub repository**

2. **Add GitHub Secrets:**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add secrets:
     - `LIGHTSAIL_HOST`: Your Lightsail instance IP
     - `LIGHTSAIL_SSH_KEY`: Your private key content

3. **Pipeline triggers automatically** on push to main branch

### Alternative Free Options:

## GitLab CI/CD (400 min/month free)
```yaml
# .gitlab-ci.yml
deploy:
  stage: deploy
  script:
    - scp -i $SSH_KEY -r . bitnami@$LIGHTSAIL_HOST:/opt/bitnami/apache/htdocs/
    - ssh -i $SSH_KEY bitnami@$LIGHTSAIL_HOST "sudo /opt/bitnami/ctlscript.sh restart apache"
  only:
    - main
```

## AWS CodePipeline (1 pipeline free)
```yaml
# buildspec.yml
version: 0.2
phases:
  build:
    commands:
      - echo "Deploying to Lightsail..."
      - aws lightsail put-instance-public-ports --instance-name myapp
```

## Manual Deployment (Always Free)
```bash
# One-time setup
git clone your-repo
cd your-repo

# Deploy script
scp -i lightsail-key.pem -r . bitnami@YOUR-IP:/opt/bitnami/apache/htdocs/
```

**Recommendation:** Start with GitHub Actions - it's the most feature-rich free option.