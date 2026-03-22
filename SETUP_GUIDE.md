# YOLOv8 Detection with FastAPI & React

This project implements real-time object detection using YOLOv8 with a FastAPI backend and React frontend.

## 📋 Project Structure

```
ML_model/
├── backend.py                 # FastAPI backend
├── requirements.txt           # Python dependencies
├── detection.py              # Video detection script
├── train_model.py            # Model training script
├── data.yaml                 # Dataset configuration
├── dataset/                  # Training data
│   ├── images/
│   │   ├── train/
│   │   └── val/
│   └── labels/
│       ├── train/
│       └── val/
├── runs/                     # Training results
│   └── detect/
│       └── train/
│           └── weights/
│               └── best.pt   # Trained model
├── frontend/                 # React frontend
│   ├── package.json
│   ├── index.html           # Single-page HTML frontend
│   └── public/
└── README.md
```

## 🚀 Quick Start

### Backend Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start FastAPI server:**
   ```bash
   python -m uvicorn backend:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

#### Option 1: Simple HTML Frontend (Recommended for Quick Start)

Simply open `frontend/index.html` in your browser:
```bash
# Windows
start frontend/index.html

# Linux
xdg-open frontend/index.html

# macOS
open frontend/index.html
```

Or serve it with a simple HTTP server:
```bash
python -m http.server 8080 --directory frontend
```

Then open `http://localhost:8080`

#### Option 2: React Development Setup

1. **Install Node.js dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

   The frontend will run at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🎯 API Endpoints

### 1. **Health Check**
```
GET /health
```

### 2. **Detect Objects in Image**
```
POST /detect/image
Content-Type: multipart/form-data

file: <image file>
```

**Response:**
```json
{
  "image": "<base64 encoded image>",
  "detections": [
    {
      "class": "car",
      "confidence": 0.95,
      "bbox": [100, 50, 300, 250]
    }
  ],
  "detection_count": 1
}
```

### 3. **Stream Video (MJPEG)**
```
GET /detect/video/stream?source=0
```

**Parameters:**
- `source`: Video source (0 for webcam, or file path)

### 4. **WebSocket Video Stream** (Recommended)
```
WebSocket ws://localhost:8000/ws/video?source=0
```

**Receives JSON:**
```json
{
  "frame": "<base64 encoded frame>",
  "detections": [...],
  "frame_shape": {"width": 640, "height": 480},
  "model_classes": ["Motor cycle", "bicycle", "car", "person"]
}
```

### 5. **Process Uploaded Video**
```
POST /detect/video/file
Content-Type: multipart/form-data

file: <video file>
```

### 6. **Get Model Classes**
```
GET /models/classes
```

### 7. **Get API Configuration**
```
GET /config
```

## 🎥 Usage Guide

### Real-Time Webcam Detection

1. Start the backend:
   ```bash
   python -m uvicorn backend:app --reload
   ```

2. Open the frontend and click "▶ Start Stream"
   - Default source is `0` (webcam)
   - Select "WebSocket (Recommended)" for best performance

### Detect Objects in Image

1. Upload an image using the "Upload Image" button
2. Detections will be displayed with confidence scores

### Process Video File

1. Upload a video file using the "Upload Video" button
2. Click "📹 Process Video"
3. Output will be saved in the project directory

### Custom Video Source

1. Enter the file path in "Video Source" (e.g., `path/to/video.mp4`)
2. Click "▶ Start Stream"

## 🏋️ Training Your Own Model

Use the provided training scripts:

```bash
# Extract frames from video
python Extract_images_from_video.py

# Split dataset into train/val
python train_validation.py

# Train model
python train_model.py
```

After training, the best model will be saved at `runs/detect/train/weights/best.pt`

## 📊 Detected Classes

- **Motor cycle** - Motorcycles
- **bicycle** - Bicycles
- **car** - Cars/Automobiles
- **person** - People

## 🔧 Configuration

### Backend Configuration (backend.py)

Key settings you can modify:

- **Model**: Change to `YOLOv8m.pt` or `YOLOv8l.pt` for better accuracy
- **Frame size**: Modify `(640, 480)` for different resolutions
- **JPEG quality**: Change `IMWRITE_JPEG_QUALITY` value (1-100)
- **Connection type**: Switch between WebSocket and MJPEG streaming

### Frontend Configuration (frontend/index.html)

Key settings:

- **API host**: Change `window.location.host` to connect to different server
- **Connection type**: WebSocket (recommended) or MJPEG
- **Colors and styling**: Modify CSS variables

## 🐛 Troubleshooting

### "Cannot open video source"
- Ensure webcam is connected or file path is correct
- Try using source `0` for default webcam
- Check camera permissions

### Low FPS or Laggy Detection
- Reduce frame resolution in backend.py
- Increase JPEG compression (lower quality)
- Use smaller model (`YOLOv8n.pt`)
- Switch to MJPEG streaming if WebSocket has issues

### Connection Issues
- Ensure backend is running on correct address
- Check firewall settings
- Verify CORS middleware is enabled (it is by default)
- Try refreshing the browser

### GPU Usage
- Ensure GPU drivers are installed
- Check if CUDA is available: `python -c "import torch; print(torch.cuda.is_available())"`
- Model will automatically use GPU if available

## 📦 Dependencies

### Python (Backend)
- FastAPI==0.104.1
- uvicorn==0.24.0
- opencv-python==4.8.0.76
- ultralytics==8.0.207
- torch==2.0.1
- numpy==1.24.3

### JavaScript (Frontend)
- React==18.2.0
- axios==1.5.0

## 🌐 Deployment

### Local Network Access

To access from other computers on your network:

1. Start backend:
   ```bash
   python -m uvicorn backend:app --host 0.0.0.0 --port 8000
   ```

2. Find your machine's IP:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

3. Access from another computer:
   ```
   http://<your-ip>:8080/frontend/index.html
   http://<your-ip>:8000/config  (API)
   ```

### Production Deployment

For production, use:

```bash
python -m uvicorn backend:app --host 0.0.0.0 --port 80 --workers 4
```

## 📈 Performance Tips

1. Use smaller model size for faster inference: `YOLOv8n.pt`
2. Reduce frame resolution to 480p
3. Skip frames if real-time isn't critical
4. Use JPEG compression to reduce bandwidth
5. Deploy backend and frontend on same machine for best latency

## 📝 License

This project uses YOLOv8 which is licensed under AGPL-3.0.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review FastAPI documentation: https://fastapi.tiangolo.com/
3. Review Ultralytics YOLOv8: https://github.com/ultralytics/ultralytics
4. Check React documentation: https://react.dev/
