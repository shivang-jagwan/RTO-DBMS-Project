@echo off
echo ==========================================
echo   Traffic Violation Dashboard
echo   Vercel Deployment Test
echo ==========================================
echo.

echo 🔍 Installing Vercel CLI...
npm install -g vercel

echo.
echo 🚀 Testing Vercel deployment locally...
vercel dev

echo.
echo ✅ Vercel test completed!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Connect your GitHub repo to Vercel
echo 3. Deploy automatically
echo.
pause