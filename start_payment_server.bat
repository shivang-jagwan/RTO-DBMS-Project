@echo off
cd /d "%~dp0backend"
echo Starting Payment Server...
echo Press Ctrl+C to stop
:loop
node payment_server.js
echo Server stopped. Restarting in 3 seconds...
timeout /t 3
goto loop