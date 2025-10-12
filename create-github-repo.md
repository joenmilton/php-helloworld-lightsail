# Create New GitHub Repository

## Steps:

1. **Go to GitHub.com and create repository:**
   - Visit: https://github.com/new
   - Repository name: `php-helloworld-lightsail`
   - Description: `PHP Hello World project with Lightsail deployment pipeline`
   - Set to Public (free)
   - Don't initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Copy the repository URL** (will look like):
   `https://github.com/YOUR_USERNAME/php-helloworld-lightsail.git`

3. **Run these commands in your terminal:**

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/php-helloworld-lightsail.git

# Push to GitHub
git push -u origin main
```

4. **Your repository will be live at:**
   `https://github.com/YOUR_USERNAME/php-helloworld-lightsail`

## After pushing:
- GitHub Actions pipeline will be ready
- Add secrets for Lightsail deployment
- Pipeline runs automatically on code changes