@echo off
echo ======================================
echo   Traffic Violation Dashboard
echo   Backend Server Startup
echo ======================================
echo.

cd /d "%~dp0backend"

echo 🔍 Checking Python environment...
if exist "env\Scripts\activate.bat" (
    echo ✅ Virtual environment found
    call env\Scripts\activate.bat
) else (
    echo ⚠️  Virtual environment not found at env\Scripts\activate.bat
    echo 💡 Please ensure you have created the virtual environment
    pause
    exit /b 1
)

echo.
echo 📦 Installing/Updating dependencies...
python -m pip install -r requirements.txt

echo.
echo 🚀 Starting FastAPI server...
echo 📍 Server will be available at: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo ⏹️  Press Ctrl+C to stop the server
echo ======================================

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause