@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                         🎨 Studio AI                        ║
echo ║                Premium Marketing Image Generator              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8 or higher.
    echo    Download from: https://python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python found

REM Install dependencies if needed
if not exist "venv\" (
    echo 📦 Setting up virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo 📦 Installing/updating dependencies...
pip install -r requirements.txt

REM Check for .env file
if not exist ".env" (
    echo ⚠️  .env file not found
    if exist ".env.example" (
        echo    Copy .env.example to .env and add your API keys
        copy .env.example .env
        echo    Edit .env file with your actual API tokens
        pause
    )
)

REM Create necessary directories
if not exist "static\generated_images\" mkdir static\generated_images

echo.
echo 🚀 Starting Studio AI server...
echo    Server will be available at: http://localhost:8000
echo    Press Ctrl+C to stop the server
echo.

uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause