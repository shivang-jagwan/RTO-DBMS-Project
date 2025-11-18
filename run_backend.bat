@echo off
echo =====================================
echo   Traffic Violation Dashboard
echo   Backend Server Startup
echo =====================================
echo.
cd /d "%~dp0backend"

echo 🚀 Starting backend server...
echo 📍 Server URL: http://localhost:8000
echo 📚 Frontend URL: http://localhost:3000
echo.
echo ⏹️  Press Ctrl+C to stop the server
echo =====================================

:start
node simple_server.js
if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ Server stopped with error. Restarting in 3 seconds...
    timeout /t 3 /nobreak
    goto start
)
echo 👋 Server stopped gracefully.
pause