#!/bin/bash

# Navigate to the temporary directory
cd /tmp

# Download Node.js
# wget https://nodejs.org/dist/v18.16.1/node-v18.16.1-linux-x64.tar.xz

wget https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64.tar.xz

# Extract Node.js to /opt/nodejs
sudo mkdir -p /opt/nodejs
# sudo tar -xJvf node-v18.16.1-linux-x64.tar.xz -C /opt/nodejs --strip-components=1

sudo tar -xJvf node-v20.11.1-linux-x64.tar.xz -C /opt/nodejs --strip-components=1


# Create symbolic links
sudo ln -s /opt/nodejs/bin/node /usr/bin/node
sudo ln -s /opt/nodejs/bin/npm /usr/bin/npm

# Cleanup downloaded tarball (optional)
# rm node-v18.16.1-linux-x64.tar.xz
rm node-v20.11.1-linux-x64.tar.xz


echo "Node.js has been installed successfully!"

# Add path to nodejs to ~/.bashrc
echo 'export PATH=$PATH:/opt/nodejs/bin' >> ~/.bashrc
source ~/.bashrc

# Additional steps
sudo mkdir -p /opt/bitnami/apache/apps
sudo chown bitnami:root /opt/bitnami/apache/apps
cd /opt/bitnami/apache/apps
sudo npm install -g pm2

# Update PATH and source .bashrc
export PATH=$PATH:/opt/nodejs/bin
source ~/.bashrc

echo "Additional setup completed successfully!"
