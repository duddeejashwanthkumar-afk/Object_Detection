@echo off
REM YOLOv8 Detection System - Frontend Server (Windows)
echo.
echo ================================================================================
echo Starting YOLOv8 Frontend Server
echo ================================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+
    exit /b 1
)

REM Navigate to frontend
cd frontend

REM Start simple HTTP server
echo Frontend will run at: http://localhost:8080
echo Opening in browser...
echo.
python -m http.server 8080

pause
