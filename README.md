# Trivy Web Scanner - Universal Installation & Setup Guide

This guide will help you set up the Trivy Web Scanner application on any system that supports Node.js and Trivy.

## License

This software is licensed under the GNU General Public License v3.0 - see [GNU GPL v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) for details.

## Prerequisites

* Any Linux-based OS (Ubuntu, Debian, CentOS, etc.)
* [Trivy scanner](https://github.com/aquasecurity/trivy) (installation instructions provided below)
* Node.js and npm (installation instructions provided below)

## Step 1: Install Trivy

Follow the official installation guide for your specific OS:

### For Debian/Ubuntu:
```bash
sudo apt-get update
sudo apt-get install wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```

### For RHEL/CentOS:
```bash
sudo rpm -ivh https://github.com/aquasecurity/trivy/releases/download/v0.45.1/trivy_0.45.1_Linux-64bit.rpm
```

### For other systems:
Visit [Trivy's GitHub repository](https://github.com/aquasecurity/trivy) for installation instructions for your specific system.

Verify the installation:
```bash
trivy --version
```

## Step 2: Install Node.js and npm

There are multiple ways to install Node.js:

### Using package manager:
#### For Debian/Ubuntu:
```bash
sudo apt update
sudo apt install -y nodejs npm
```

#### For RHEL/CentOS:
```bash
sudo dnf install nodejs npm
```

### Using NVM (Node Version Manager) - Recommended:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc  # Or restart your terminal
nvm install node  # Installs the latest version
```

Verify the installation:
```bash
node -v
npm -v
```

## Step 3: Create the project directory

```bash
mkdir -p ~/trivy-web-scanner/public
cd ~/trivy-web-scanner
```

## Step 4: Create the application files

You'll need to create three main files for the application:

1. `server.js` - The backend server
2. `public/index.html` - The frontend interface
3. `package.json` - The project configuration

You can use any text editor to create these files. For example:

```bash
nano server.js
# Paste your server.js content and save

nano public/index.html
# Paste your index.html content and save

nano package.json
# Paste your package.json content and save
```

## Step 5: Install dependencies

Inside the project directory, run:

```bash
npm install
```

## Step 6: Run the application

Start the server:

```bash
node server.js
```

You should see a message similar to:
```
Trivy Web Interface running on http://localhost:3000
```

## Step 7: Access the web interface

### For local development:
Simply open your web browser and navigate to http://localhost:3000

### For remote servers:

#### Option 1: SSH Port Forwarding
If you're running this on a remote server, you can use SSH port forwarding to access it securely:

```bash
ssh -L 3000:localhost:3000 username@your-server-ip
```

Then access http://localhost:3000 in your local browser.

#### Option 2: Configure a reverse proxy with Nginx

Install Nginx (if not already installed):

```bash
# Debian/Ubuntu
sudo apt install -y nginx

# RHEL/CentOS
sudo dnf install nginx
```

Create a new Nginx site configuration:

```bash
sudo nano /etc/nginx/sites-available/trivy-scanner  # For Debian/Ubuntu
# OR
sudo nano /etc/nginx/conf.d/trivy-scanner.conf  # For RHEL/CentOS
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-server-domain-or-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site (Debian/Ubuntu only):

```bash
sudo ln -s /etc/nginx/sites-available/trivy-scanner /etc/nginx/sites-enabled/
```

Test and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Running as a service (optional)

To keep the application running after closing your terminal or rebooting, you can set it up as a system service:

### Using systemd:

Create a service file:

```bash
sudo nano /etc/systemd/system/trivy-web.service
```

Add the following content:

```ini
[Unit]
Description=Trivy Web Scanner
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/path/to/trivy-web-scanner
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Replace `YOUR_USERNAME` and `/path/to/trivy-web-scanner` with your actual username and the absolute path to the project directory.

Enable and start the service:

```bash
sudo systemctl enable trivy-web
sudo systemctl start trivy-web
```

Check the status:

```bash
sudo systemctl status trivy-web
```

## Step 9: Security considerations

1. **Authentication**: Consider implementing authentication for the web interface
2. **HTTPS**: Configure SSL/TLS if exposing the service publicly
3. **Firewall**: Ensure your firewall is properly configured to allow only necessary traffic

## Troubleshooting

1. **Port conflicts**: If port 3000 is already in use, change the port in server.js
2. **Permission issues**: Ensure the user running the application has permissions to execute Trivy
3. **Trivy not found**: Make sure Trivy is installed and in your PATH

For additional support, check the [Trivy documentation](https://aquasecurity.github.io/trivy/) or open an issue on GitHub.
