# Trivy Web Scanner - Installation & Setup Guide

This guide will help you set up the Trivy Web Scanner application on your Debian 12 VPS.

## Prerequisites

* Debian 12 VPS (already set up)
* Trivy scanner (already installed)
* Node.js (will install in this guide)
* npm (will install in this guide)

## Step 1: Install Node.js and npm

Update your package index and install Node.js and npm:

```bash
sudo apt update
sudo apt install -y nodejs npm
```

Verify the installation:

```bash
node -v
npm -v
```

## Step 2: Create the project directory

```bash
mkdir -p ~/trivy-web-scanner/public
cd ~/trivy-web-scanner
```

## Step 3: Create the application files

1. Create the server.js file (copy the content from the "Trivy Web Scanner Application" artifact)
2. Create the public/index.html file (copy the content from the "Trivy Scanner Frontend" artifact)
3. Create the package.json file (copy the content from the "Package.json for Trivy Web Scanner" artifact)

You can use any text editor like nano or vim to create these files:

```bash
nano server.js
# Paste the server.js content and save

nano public/index.html
# Paste the index.html content and save

nano package.json
# Paste the package.json content and save
```

## Step 4: Install dependencies

Inside the project directory, run:

```bash
npm install
```

## Step 5: Run the application

Start the server:

```bash
node server.js
```

You should see the message:
```
Trivy Web Interface running on http://localhost:3000
```

## Step 6: Access the web interface

If you're running this on a remote VPS, you'll need to set up either port forwarding or a reverse proxy to access the web interface.

### Option 1: SSH Port Forwarding

From your local machine, run:

```bash
ssh -L 3000:localhost:3000 username@your-vps-ip
```

Then access the web interface at http://localhost:3000 in your local browser.

### Option 2: Configure Nginx as a reverse proxy

Install Nginx:

```bash
sudo apt install -y nginx
```

Create a new Nginx site configuration:

```bash
sudo nano /etc/nginx/sites-available/trivy-scanner
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-server-domain-or-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set
