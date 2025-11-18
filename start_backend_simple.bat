@echo off
cd /d "%~dp0backend"
echo Activating virtual environment...
call env\Scripts\activate.bat
echo Starting server on port 8000...
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --log-level info
pause