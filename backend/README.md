# Backend README

## Overview
This folder contains the FastAPI backend for the YOLOv8 real-time object detection application.

This project implements object detection using YOLOv8 for detecting motorcycles, bicycles, cars, and persons in videos.

## Features

- Extract frames from video for dataset creation
- Train YOLOv8 model on custom dataset
- Run real-time detection on videos
- Save annotated output videos
- FastAPI backend with WebSocket and MJPEG streaming
- React frontend for real-time visualization

## Dataset

The dataset contains 4 classes:
- Motor cycle
- bicycle
- car
- person

Dataset structure:
```
dataset/
├── images/
│   ├── train/
│   └── val/
└── labels/
    ├── train/
    └── val/
```

Labels are in YOLO format (.txt files).

## Files
- `backend.py`: Main FastAPI application with endpoints for video streaming, image detection, and WebSocket support.
- `requirements.txt`: Python dependencies.
- `start_backend.bat`: Windows batch script to start the backend.
- `yolov8n.pt`: Pretrained YOLOv8 model.
- `train_model.py`: Model training script.
- `train_validation.py`: Validation script.
- `detection.py`: Detection utilities.
- `Extract_images_from_video.py`: Video frame extraction.
- `data.yaml`: Dataset configuration.
- `dataset/`: Training data.
- `runs/`: Training outputs.
- `templates/`: Additional templates.
- `__pycache__/`: Python bytecode cache.

## Setup
1. Ensure Python 3.8+ is installed.
2. Create a virtual environment: `python -m venv venv`
3. Activate: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
4. Install dependencies: `pip install -r requirements.txt`
5. Run: `uvicorn backend:app --reload --host 0.0.0.0 --port 8000`

## Usage

### 1. Extract Frames from Video (Optional)

If you have raw video data, use `Extract_images_from_video.py` to extract frames:

```python
python Extract_images_from_video.py
```

### 2. Train Model (Optional)

To train a custom model:

```python
python train_model.py
```

### 3. Run Detection

Start the FastAPI server and use the endpoints for detection.

## Endpoints
- `GET /health`: Health check
- `POST /detect/image`: Image detection
- `GET /detect/video/stream`: MJPEG video stream
- `WS /ws/video`: WebSocket video stream
- `POST /detect/video/file`: Video file processing

## Notes
- Uses YOLOv8 model (yolov8n.pt or trained weights).
- Supports webcam (source=0) or video file paths.