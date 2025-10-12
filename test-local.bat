@echo off
echo Testing PHP Hello World locally...

REM Check if PHP is installed
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo PHP not found! Install PHP 8.2+ first.
    echo Download from: https://windows.php.net/download/
    pause
    exit /b 1
)

echo PHP found! Starting local server...
echo.
echo Access your app at: http://localhost:8000
echo Press Ctrl+C to stop
echo.

php -S localhost:8000