# Frontend README

## Overview
This folder contains the React frontend for the YOLOv8 real-time object detection application.

## Files
- `package.json`: Node.js dependencies and scripts.
- `public/`: Static assets (index.html, manifest.json, etc.).
- `src/`: React source code.
  - `App.jsx`: Main app component.
  - `components/`: UI components (VideoStream, Controls, Statistics, DetectionsList).
- `src/index.jsx`: App entry point.

## Setup
1. Ensure Node.js 14+ is installed.
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Open `http://localhost:3000` in browser.

## Features
- Real-time video streaming (WebSocket or MJPEG).
- Object detection display with bounding boxes.
- Statistics and detections list.
- Image and video upload for processing.

## Environment Variables
- `REACT_APP_API_URL`: Backend URL (default: localhost:8000)

## Notes
- Connects to FastAPI backend for streaming and detection.
- `start_frontend.bat`: Windows batch script to start the frontend.
- `start_frontend.sh`: Linux/Mac shell script to start the frontend.