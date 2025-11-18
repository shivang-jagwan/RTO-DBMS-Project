@echo off
echo ======================================
echo   Traffic Violation Dashboard
echo   Frontend Server Startup  
echo ======================================
echo.

cd /d "%~dp0frontend"

echo 🔍 Checking Node.js environment...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found! Please install Node.js first
    echo 💡 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

echo.
echo 📦 Installing dependencies...
if not exist "node_modules" (
    npm install
) else (
    echo 📦 Dependencies already installed
)

echo.
echo 🚀 Starting frontend server...
echo 📍 Frontend will be available at: http://localhost:3000
echo.
echo ⏹️  Press Ctrl+C to stop the server
echo ======================================

npm start

pause