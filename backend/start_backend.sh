#!/bin/bash
# YOLOv8 Detection System - Quick Start Script (Linux/macOS)

echo ""
echo "================================================================================"
echo "Starting Object Detection System"
echo "================================================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo ""
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Start Backend
echo ""
echo "================================================================================"
echo "Starting FastAPI Backend Server..."
echo "================================================================================"
echo "Backend will run at: http://localhost:8000"
echo "API Docs at: http://localhost:8000/docs"
echo ""
python -m uvicorn backend:app --reload --host 0.0.0.0 --port 8000
