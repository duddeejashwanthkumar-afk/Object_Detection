from fastapi import FastAPI, File, UploadFile, HTTPException, WebSocket
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import cv2
import numpy as np
from ultralytics import YOLO
import asyncio
import base64
from pathlib import Path
import io

app = FastAPI(title="YOLOv8 Detection API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
try:
    model = YOLO("runs/detect/train/weights/best.pt")
except:
    print("Best model not found, using pretrained YOLOv8n")
    model = YOLO("yolov8n.pt")

# Store connection status
video_source = None
is_streaming = False


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    """Detect objects in uploaded image"""
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image")
        
        results = model(frame)
        annotated_frame = results[0].plot()
        
        # Convert to base64
        _, buffer = cv2.imencode('.jpg', annotated_frame)
        img_base64 = base64.b64encode(buffer).decode()
        
        # Extract detections
        detections = []
        for box in results[0].boxes:
            detections.append({
                "class": model.names[int(box.cls[0])],
                "confidence": float(box.conf[0]),
                "bbox": box.xyxy[0].tolist()
            })
        
        return {
            "image": img_base64,
            "detections": detections,
            "detection_count": len(detections)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/detect/video/stream")
async def stream_video(source: str = "0"):
    """Stream video with real-time detection"""
    
    def generate_frames():
        try:
            # Open video source (0 for webcam, or video file path)
            if source.isdigit():
                cap = cv2.VideoCapture(int(source))
            else:
                cap = cv2.VideoCapture(source)
            
            if not cap.isOpened():
                raise Exception(f"Cannot open video source: {source}")
            
            frame_skip = 0  # Process every frame
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Resize for faster processing
                frame = cv2.resize(frame, (640, 480))
                
                # Run detection
                results = model(frame)
                annotated_frame = results[0].plot()
                
                # Encode frame
                _, buffer = cv2.imencode('.jpg', annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                frame_bytes = buffer.tobytes()
                
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n'
                       b'Content-Length: ' + f'{len(frame_bytes)}'.encode() + b'\r\n\r\n' + 
                       frame_bytes + b'\r\n')
            
            cap.release()
        except Exception as e:
            print(f"Stream error: {e}")
    
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.websocket("/ws/video")
async def websocket_video_endpoint(websocket: WebSocket, source: str = "0"):
    """WebSocket endpoint for real-time video streaming"""
    await websocket.accept()
    
    try:
        # Open video source
        if source.isdigit():
            cap = cv2.VideoCapture(int(source))
        else:
            cap = cv2.VideoCapture(source)
        
        if not cap.isOpened():
            await websocket.send_json({"error": f"Cannot open video source: {source}"})
            await websocket.close()
            return
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Resize for faster processing
            frame = cv2.resize(frame, (640, 480))
            
            # Run detection
            results = model(frame)
            annotated_frame = results[0].plot()
            
            # Prepare detections data
            detections = []
            for box in results[0].boxes:
                detections.append({
                    "class": model.names[int(box.cls[0])],
                    "confidence": round(float(box.conf[0]), 3),
                    "bbox": [float(x) for x in box.xyxy[0].tolist()]
                })
            
            # Encode frame to base64
            _, buffer = cv2.imencode('.jpg', annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame_base64 = base64.b64encode(buffer).decode()
            
            # Send frame and detections
            await websocket.send_json({
                "frame": frame_base64,
                "detections": detections,
                "frame_shape": {"width": frame.shape[1], "height": frame.shape[0]},
                "model_classes": model.names
            })
            
            # Small delay to prevent overwhelming
            await asyncio.sleep(0.01)
        
        cap.release()
    except Exception as e:
        await websocket.send_json({"error": str(e)})
    finally:
        await websocket.close()


@app.post("/detect/video/file")
async def detect_video_file(file: UploadFile = File(...)):
    """Process uploaded video file and return detected frames"""
    try:
        # Save uploaded file
        contents = await file.read()
        file_path = Path(f"temp_{file.filename}")
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Process video
        cap = cv2.VideoCapture(str(file_path))
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        # Create output video
        output_path = f"output_{file.filename}"
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        frame_count = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            results = model(frame)
            annotated_frame = results[0].plot()
            out.write(annotated_frame)
            frame_count += 1
        
        cap.release()
        out.release()
        
        # Clean up temp file
        file_path.unlink()
        
        return {
            "status": "success",
            "frames_processed": frame_count,
            "output_file": output_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/models/classes")
async def get_classes():
    """Get list of classes the model can detect"""
    return {
        "classes": model.names,
        "class_count": len(model.names)
    }


@app.get("/config")
async def get_config():
    """Get API configuration"""
    return {
        "api_version": "1.0",
        "model": "YOLOv8",
        "classes": model.names,
        "endpoints": {
            "image_detection": "/detect/image",
            "video_stream": "/detect/video/stream",
            "video_websocket": "/ws/video",
            "video_file": "/detect/video/file"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
