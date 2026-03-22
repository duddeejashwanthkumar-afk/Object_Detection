#!/bin/bash
# YOLOv8 Detection System - Frontend Server (Linux/macOS)

echo ""
echo "================================================================================"
echo "Starting YOLOv8 Frontend Server"
echo "================================================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Navigate to frontend
cd frontend

# Start simple HTTP server
echo "Frontend will run at: http://localhost:8080"
echo "You can now open http://localhost:8080/index.html in your browser"
echo ""
python3 -m http.server 8080
