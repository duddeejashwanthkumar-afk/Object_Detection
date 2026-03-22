# Quick Start Guide - Choose Your Setup

## 🚀 Fastest Way to Get Started

### Option 1: Simple HTML Frontend (⭐ RECOMMENDED)

**Windows:**
1. Open PowerShell in project folder
2. Run:
   ```powershell
   .\venv\Scripts\Activate.ps1
   python -m uvicorn backend:app --reload
   ```
3. In another PowerShell window:
   ```powershell
   cd frontend
   python -m http.server 8080
   ```
4. Open `http://localhost:8080/index.html` in browser

**Linux/macOS:**
1. Run:
   ```bash
   source venv/bin/activate
   python -m uvicorn backend:app --reload
   ```
2. In another terminal:
   ```bash
   cd frontend
   python -m http.server 8080
   ```
3. Open `http://localhost:8080/index.html` in browser

---

## 🎯 Using Batch Scripts (Windows)

### Automatic Setup
1. Double-click `start_backend.bat` → Backend starts on port 8000
2. Double-click `start_frontend.bat` → Frontend starts on port 8080
3. Open `http://localhost:8080/index.html`

---

## ⚛️ React Development Setup (Advanced)

Only if you want to develop React components:

```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000 automatically
```

---

## 📋 What Each Component Does

| Component | Port | Purpose |
|-----------|------|---------|
| **FastAPI Backend** | 8000 | Processes video/images, runs YOLOv8 |
| **Frontend (HTML)** | 8080 | Simple, no-build UI |
| **React Dev Server** | 3000 | Development environment |

---

## 🧪 Test It Works

1. Backend running? Check: `http://localhost:8000/health`
2. Frontend running? Check: `http://localhost:8080/index.html`
3. Click "Start Stream" → Should see webcam feed with detections

---

## 🎥 Next Steps

1. **Adjust settings** in the UI
2. **Upload images/videos** for batch processing
3. **Change video source** (file path instead of 0)
4. **Monitor statistics** panel for performance
5. **Train your own model** using train_model.py

---

## ⚠️ Troubleshooting

**Module not found?**
```bash
pip install -r requirements.txt
```

**Port already in use?**
```bash
# Use different ports
python -m uvicorn backend:app --port 8001
python -m http.server 8081 --directory frontend
```

**Webcam not working?**
- Check camera permissions
- Close other camera apps
- Try source "0" (default)

---

📖 For detailed setup: See `SETUP_GUIDE.md` or `WINDOWS_SETUP.md`
