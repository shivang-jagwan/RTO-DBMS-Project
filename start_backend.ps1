# PowerShell script to start backend server
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   Traffic Violation Dashboard" -ForegroundColor Yellow  
Write-Host "   Backend Server Startup" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Change to backend directory
$backendPath = Join-Path $PSScriptRoot "backend"
Set-Location $backendPath

Write-Host "🔍 Checking Python environment..." -ForegroundColor Blue

# Check if virtual environment exists
$venvPath = Join-Path $backendPath "env\Scripts\Activate.ps1"
if (Test-Path $venvPath) {
    Write-Host "✅ Virtual environment found" -ForegroundColor Green
    & $venvPath
} else {
    Write-Host "⚠️  Virtual environment not found at $venvPath" -ForegroundColor Red
    Write-Host "💡 Please create virtual environment with: python -m venv env" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "📦 Installing/Updating dependencies..." -ForegroundColor Blue
python -m pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting FastAPI server..." -ForegroundColor Green
Write-Host "📍 Server will be available at: http://localhost:8000" -ForegroundColor Yellow
Write-Host "📚 API Documentation: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏹️  Press Ctrl+C to stop the server" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Cyan

# Start the server
try {
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
} catch {
    Write-Host "❌ Failed to start server: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Server stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit"