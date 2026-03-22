# Project Architecture & Analysis

## 📊 Complete Project Overview

This is a professional **YOLOv8 Object Detection System** with real-time video streaming capabilities using a modern tech stack.

### Project Goals
- Detect motorcycles, bicycles, cars, and persons in real-time video streams
- Provide web-based UI for visualization and control
- Support multiple video sources (webcam, files, streams)
- Fast inference with YOLOv8 neural network

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│  React Frontend (http://localhost:3000)                    │
│  ├─ App.jsx (Main component)                             │
│  ├─ VideoStream.jsx (Real-time display)                 │
│  ├─ Controls.jsx (User interactions)                    │
│  ├─ Statistics.jsx (Real-time stats)                    │
│  └─ DetectionsList.jsx (Detected objects)               │
│                                                           │
│  OR HTML Frontend (frontend/index.html)                  │
│  └─ Single-page app with WebSocket support              │
└─────────────────────────────────────────────────────────────┘
                            ▼
                    WebSocket / HTTP
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                          │
├─────────────────────────────────────────────────────────────┤
│  FastAPI Backend (http://localhost:8000)                   │
│  ├─ /ws/video (WebSocket streaming)                       │
│  ├─ /detect/video/stream (MJPEG streaming)               │
│  ├─ /detect/image (Static image detection)               │
│  ├─ /detect/video/file (Video file processing)           │
│  └─ Endpoints for configuration & health                 │
│                                                           │
│  YOLOv8 Model (runs/detect/train/weights/best.pt)       │
│  ├─ Trained on custom dataset                            │
│  ├─ Classes: motorcycle, bicycle, car, person            │
│  └─ Fast inference (~30-60ms per frame)                  │
│                                                           │
│  OpenCV (Frame processing)                               │
│  └─ Video capture, encoding, transformations             │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   VIDEO SOURCES                             │
├─────────────────────────────────────────────────────────────┤
│  • Webcam (source=0)                                       │
│  • Video files (source=/path/to/video.mp4)               │
│  • IP cameras (source=rtsp://...)                        │
│  • Screen capture / RTSP streams                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
ML_model/
│
├── 🔧 Configuration Files
│   ├── requirements.txt          # Python dependencies
│   ├── data.yaml               # Dataset config for YOLOv8
│   ├── SETUP_GUIDE.md          # Detailed setup instructions
│   └── WINDOWS_SETUP.md        # Windows-specific setup
│
├── 🎯 Backend (FastAPI)
│   ├── backend.py              # Main FastAPI application
│   │   ├── /health             # Health check
│   │   ├── /detect/image       # Image detection API
│   │   ├── /detect/video/stream # MJPEG streaming
│   │   ├── /ws/video           # WebSocket streaming
│   │   ├── /detect/video/file  # Video file processing
│   │   ├── /models/classes     # Get model classes
│   │   └── /config             # API configuration
│   │
│   ├── detection.py            # Batch video detection script
│   ├── train_model.py          # Model training script
│   └── Extract_images_from_video.py # Dataset preparation
│
├── 🎨 Frontend
│   ├── frontend/
│   │   ├── index.html          # Simple HTML UI (RECOMMENDED for quick start)
│   │   ├── package.json        # npm dependencies
│   │   ├── public/
│   │   │   └── index.html      # React HTML entry point
│   │   └── src/
│   │       ├── App.jsx         # Main React component
│   │       ├── App.css         # Application styles
│   │       ├── index.jsx       # React entry point
│   │       ├── index.css       # Global styles
│   │       └── components/
│   │           ├── VideoStream.jsx    # Video display
│   │           ├── Controls.jsx       # Control interface
│   │           ├── Statistics.jsx     # Stats display
│   │           └── DetectionsList.jsx # Detections panel
│   │
│   └── [Optional React setup files]
│
├── 🤖 ML Model & Data
│   ├── yolov8n.pt              # Pre-trained nano model
│   ├── dataset/
│   │   ├── images/
│   │   │   ├── train/          # Training images
│   │   │   └── val/            # Validation images
│   │   └── labels/
│   │       ├── train/          # Training labels (.txt)
│   │       └── val/            # Validation labels (.txt)
│   │
│   ├── runs/                   # Training outputs
│   │   └── detect/
│   │       └── train/
│   │           ├── results.png
│   │           ├── confusion_matrix.png
│   │           └── weights/
│   │               ├── best.pt      # Best model weights
│   │               └── last.pt      # Last checkpoint
│   │
│   └── templates/              # (Optional) saved results
│
└── 📚 Documentation
    ├── README.md               # Project overview
    ├── SETUP_GUIDE.md         # Setup instructions
    └── PROJECT_ANALYSIS.md    # This file
```

---

## 🚀 Technology Stack

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **FastAPI** | Web framework | 0.104.1 |
| **Uvicorn** | ASGI server | 0.24.0 |
| **Ultralytics** | YOLOv8 implementation | 8.0.207 |
| **OpenCV** | Image processing | 4.8.0.76 |
| **PyTorch** | Deep learning | 2.0.1 |
| **NumPy** | Numerical computing | 1.24.3 |

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework | 18.2.0 |
| **HTML5** | Markup | - |
| **CSS3** | Styling | - |
| **WebSockets** | Real-time communication | Native |

### Model
| Aspect | Details |
|--------|---------|
| **Architecture** | YOLOv8 Nano (lightweight) |
| **Classes** | 4 (motorcycle, bicycle, car, person) |
| **Input Size** | 640×640 or resizable |
| **Output** | Bounding boxes + confidence scores |

---

## 🔄 Data Flow

### Real-Time Streaming (WebSocket)

```
1. User clicks "Start Stream"
   ↓
2. Browser initiates WebSocket connection
   ↓
3. FastAPI opens video capture (webcam/file)
   ↓
4. For each frame:
   a) Read frame from video source
   b) Resize to 640×480 for efficiency
   c) Run YOLOv8 inference
   d) Extract detections (class, confidence, bbox)
   e) Encode annotated frame to base64
   f) Send JSON: {frame, detections, model_classes}
   ↓
5. Browser receives WebSocket message
   ↓
6. Display frame and update statistics
   ↓
7. Repeat until WebSocket closes
```

### Image Detection

```
1. User uploads image
   ↓
2. Frontend: POST /detect/image with multipart form
   ↓
3. Backend:
   a) Decode image bytes
   b) Run YOLOv8 inference
   c) Annotate frame with bounding boxes
   d) Encode to base64
   ↓
4. Return JSON with image and detections
   ↓
5. Display in frontend
```

### Video File Processing

```
1. User uploads video file
   ↓
2. Frontend: POST /detect/video/file
   ↓
3. Backend:
   a) Save uploaded file
   b) Open with OpenCV
   c) For each frame: detect → annotate
   d) Write to output MP4
   ↓
4. Return output filename
   ↓
5. User downloads result
```

---

## 📊 Key Components Explained

### Backend Endpoints

#### WebSocket `/ws/video?source=0`
- **Purpose**: Real-time bidirectional streaming
- **Best for**: Live monitoring, low latency
- **Data sent**: Video frame (base64) + detections (JSON)
- **Frame rate**: ~30 FPS depending on hardware

#### REST `/detect/video/stream?source=0`
- **Purpose**: MJPEG streaming
- **Best for**: Lower bandwidth, simple integration
- **Format**: Continuous JPEG frames
- **Pros**: Works in all browsers, no WebSocket

#### REST `/detect/image`
- **Purpose**: Process single images
- **Input**: Multipart form with image file
- **Output**: Annotated image + detection list

#### REST `/detect/video/file`
- **Purpose**: Batch process video files
- **Input**: Video file upload
- **Output**: Saved processed video file

### Frontend Components

#### VideoStream.jsx
- Handles both WebSocket and MJPEG display
- Automatically switches based on connection type
- Shows frame in real-time

#### Controls.jsx
- Connection type selection
- Video source input
- File upload handlers
- Start/stop buttons

#### Statistics.jsx
- Detection count
- Average confidence
- Frame rate (FPS)
- Connection uptime

#### DetectionsList.jsx
- Shows recent detections
- Display class names
- Confidence percentages

---

## 🎯 Detected Classes

| Class | Description | Common Size |
|-------|-------------|------------|
| **motorcycle** | Motorcycles, scooters, bikes | Variable |
| **bicycle** | Bicycles, pedal bikes | Variable |
| **car** | Cars, sedans, SUVs, trucks | Variable |
| **person** | Humans, pedestrians | Variable |

---

## 💡 Performance Considerations

### Optimization Strategies

**Frame Resolution**
- Default: 640×480 (balanced)
- Fast mode: 416×416
- Quality mode: 1280×720

**Model Size**
- Using YOLOv8n (nano) for speed
- Can upgrade to YOLOv8m/l/x for accuracy

**Encoding Quality**
- JPEG quality: 80 (default)
- Lower = faster, lower bandwidth
- Higher = better quality, more data

**Frame Skipping**
- Process every frame by default
- Can skip frames to reduce load

### Expected Performance
- **CPU only**: 10-20 FPS (with resizing)
- **GPU (NVIDIA)**: 30-60+ FPS
- **Latency**: 30-100ms per frame
- **Memory**: ~2GB base + video buffer

---

## 🔐 Security Considerations

### Current Implementation
- CORS enabled for all origins (dev friendly)
- No authentication required
- No input validation on file uploads

### Production Recommendations
1. Enable CORS restrictions
2. Add authentication/authorization
3. Validate uploaded files
4. Rate limiting on API endpoints
5. HTTPS/WSS encryption
6. Model quantization for edge deployment

---

## 🛠️ Common Issues & Solutions

### Issue: "Cannot open video source"
**Causes**: Webcam disconnected, wrong file path, camera in use
**Solutions**: 
- Ensure camera permissions granted
- Use absolute file paths
- Close other camera apps

### Issue: Low FPS / Laggy
**Causes**: GPU not available, large model, high resolution
**Solutions**:
- Reduce frame resolution
- Use YOLOv8n instead of YOLOv8m
- Enable GPU (install CUDA)
- Reduce JPEG quality

### Issue: WebSocket connection fails
**Causes**: Wrong URL, backend not running, firewall
**Solutions**:
- Check backend URL in React
- Ensure backend running on correct port
- Check firewall rules
- Try MJPEG mode as fallback

---

## 📈 Future Enhancements

1. **Multi-GPU Support**: Distribute inference across GPUs
2. **Model Serving**: Use TensorRT or ONNX for faster inference
3. **Database**: Store detection history and analytics
4. **Mobile App**: React Native version
5. **Edge Deployment**: Docker containers, Kubernetes
6. **Advanced Analytics**: Detection heatmaps, counting
7. **Custom Model Training**: Web UI for fine-tuning
8. **Multi-stream**: Monitor multiple cameras simultaneously

---

## 📝 Quick Reference

### Start Backend
```bash
python -m uvicorn backend:app --reload --port 8000
```

### Start Frontend (React)
```bash
cd frontend
npm start
```

### Start Frontend (HTML)
```bash
python -m http.server 8080 --directory frontend
```

### Test API
```bash
curl http://localhost:8000/health
```

### Stream URL
```
WebSocket: ws://localhost:8000/ws/video?source=0
MJPEG: http://localhost:8000/detect/video/stream?source=0
```

---

## 📚 Resources

- [YOLOv8 Docs](https://docs.ultralytics.com/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [OpenCV Docs](https://docs.opencv.org/)
- [WebSocket Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
