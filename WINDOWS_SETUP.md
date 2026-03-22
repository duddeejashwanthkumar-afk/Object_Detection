# Windows Setup Script for YOLOv8 Detection with FastAPI & React

## Prerequisites
- Python 3.8+ installed
- Git installed
- Node.js installed (for React development)

## Step 1: Setup Python Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Step 2: Install Python Dependencies

```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install required packages
pip install -r requirements.txt
```

## Step 3: Prepare Model

The project expects the trained model at:
```
runs/detect/train/weights/best.pt
```

If you don't have a trained model yet:
1. Train your model using: `python train_model.py`
2. Or download a pre-trained model

## Step 4A: Run Backend (FastAPI)

```powershell
# Make sure virtual environment is activated
# .\venv\Scripts\Activate.ps1

# Start FastAPI server
python -m uvicorn backend:app --reload --host 0.0.0.0 --port 8000

# Server will run at http://localhost:8000
# API docs available at http://localhost:8000/docs
```

## Step 4B: Run Frontend (HTML)

**Option 1: Direct Open**
```powershell
# Open HTML file directly in browser
start frontend/index.html
```

**Option 2: Simple HTTP Server**
```powershell
# In a new PowerShell window:
cd frontend
python -m http.server 8080

# Open http://localhost:8080 in browser
```

**Option 3: React Development (Advanced)**
```powershell
# Install Node.js dependencies (if not already installed)
cd frontend
npm install

# Start React dev server
npm start

# Opens http://localhost:3000 automatically
```

## Step 5: Test the Application

1. **Open http://localhost:8080/index.html** or **http://localhost:3000**
2. Click "▶ Start Stream"
3. Select "WebSocket (Recommended)"
4. Detections should appear in real-time!

## Quick Start Command (All-in-One)

If you want to run both backend and frontend quickly:

```powershell
# Terminal 1: Backend
.\venv\Scripts\Activate.ps1
python -m uvicorn backend:app --reload

# Terminal 2: Frontend  
cd frontend
python -m http.server 8080

# Then open: http://localhost:8080/index.html
```

## Troubleshooting

### "Module not found" errors
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

### "Port already in use"
- Backend: Change port: `python -m uvicorn backend:app --port 8001`
- Frontend: Change port: `python -m http.server 8081`

### Webcam not working
- Open Windows Settings → Privacy & Security → Webcam
- Allow the app to access your webcam
- Try restarting the application

### Low performance
- Reduce model size: Use `yolov8n.pt` instead of larger models
- Check GPU: Run `python -c "import torch; print(torch.cuda.is_available())"`
- Close other applications to free up resources

## File Structure Created

```
ML_model/
├── backend.py              # FastAPI application
├── requirements.txt        # Python dependencies
├── frontend/
│   ├── index.html         # Web UI
│   └── package.json       # Node.js config
├── SETUP_GUIDE.md         # This file
└── [existing files...]
```

## API Testing

Test the API using the built-in docs:
1. Start backend
2. Open http://localhost:8000/docs
3. Try endpoints directly from the interactive API documentation

## Next Steps

1. ✅ Setup complete!
2. Train your model if you haven't already
3. Point the frontend to your video source
4. Monitor detections in real-time
5. (Optional) Deploy to cloud for remote access

## Performance Optimization

For better performance:
1. Use GPU: Install CUDA and cuDNN
2. Reduce resolution: `frame = cv2.resize(frame, (480, 360))`
3. Use smaller model: `YOLOv8n.pt`
4. Skip frames: Process every Nth frame

Enjoy your real-time object detection system! 🚀
