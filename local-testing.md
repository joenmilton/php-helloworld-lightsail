# Local Testing Without Docker

## Option 1: PHP Built-in Server (Recommended)

**Install PHP 8.2+ on Windows:**
- Download from: https://windows.php.net/download/
- Or use Chocolatey: `choco install php`

**Run locally:**
```bash
cd d:\DEV\repos\php
php -S localhost:8000
```
**Access:** http://localhost:8000

## Option 2: XAMPP (GUI)

**Install XAMPP:**
- Download: https://www.apachefriends.org/
- Copy files to: `C:\xampp\htdocs\`
- Start Apache in XAMPP Control Panel
**Access:** http://localhost

## Option 3: WAMP (Windows)

**Install WAMP:**
- Download: https://www.wampserver.com/
- Copy files to: `C:\wamp64\www\`
- Start WAMP services
**Access:** http://localhost

## Quick Test Commands:

```bash
# Check PHP version
php --version

# Run built-in server
php -S localhost:8000

# Test specific file
php index.php
```

**Recommended:** Use PHP built-in server - it's identical to your Lightsail environment.