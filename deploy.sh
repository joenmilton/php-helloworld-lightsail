#!/bin/bash

# Manual deployment script (always free)
# Usage: ./deploy.sh YOUR_LIGHTSAIL_IP path/to/your-key.pem

LIGHTSAIL_IP=$1
SSH_KEY=$2

if [ -z "$LIGHTSAIL_IP" ] || [ -z "$SSH_KEY" ]; then
    echo "Usage: ./deploy.sh LIGHTSAIL_IP SSH_KEY_PATH"
    echo "Example: ./deploy.sh 1.2.3.4 ~/.ssh/lightsail-key.pem"
    exit 1
fi

echo "Deploying to Lightsail: $LIGHTSAIL_IP"

# Copy files
scp -i "$SSH_KEY" -r . bitnami@"$LIGHTSAIL_IP":/opt/bitnami/apache/htdocs/

# Restart Apache
ssh -i "$SSH_KEY" bitnami@"$LIGHTSAIL_IP" "sudo /opt/bitnami/ctlscript.sh restart apache"

echo "Deployment complete! Visit: http://$LIGHTSAIL_IP"