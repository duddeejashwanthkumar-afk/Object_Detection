@echo off
REM YOLOv8 Detection System - Quick Start Script (Windows)
echo.
echo ================================================================================
echo Starting Object Detection System
echo ================================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo.
echo Installing Python dependencies...
pip install -r requirements.txt -q

REM Start Backend
echo.
echo ================================================================================
echo Starting FastAPI Backend Server...
echo ================================================================================
echo Backend will run at: http://localhost:8000
echo API Docs at: http://localhost:8000/docs
echo.
python -m uvicorn backend:app --reload --host 0.0.0.0 --port 8000

pause
