import React, { useState, useRef } from 'react';
import './App.css';
import VideoStream from './components/VideoStream';
import Controls from './components/Controls';
import Statistics from './components/Statistics';
import DetectionsList from './components/DetectionsList';

function App() {
  const [detections, setDetections] = useState([]);
  const [frameStats, setFrameStats] = useState({
    isConnected: false,
    frameCount: 0,
    detectionCount: 0,
    avgConfidence: 0,
    fps: 0,
    uptime: 0
  });
  const [connectionType, setConnectionType] = useState('websocket');
  const [videoSource, setVideoSource] = useState('0');
  const wsRef = useRef(null);
  const startTimeRef = useRef(null);

  const startStream = (source = '0') => {
    const cleanSource = source.replace(/"/g, '').trim();
    setVideoSource(cleanSource);

    if (connectionType === 'websocket') {
      startWebSocketStream(cleanSource);
    } else {
      startMJPEGStream(cleanSource);
    }
  };

  const startWebSocketStream = (source) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    // Clean up source - remove any quotes that might be included
    const cleanSource = source.replace(/"/g, '').trim();
    
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendUrl = process.env.REACT_APP_API_URL || 'localhost:8000';
    const wsUrl = `${wsProtocol}//${backendUrl}/ws/video?source=${encodeURIComponent(cleanSource)}`;

    wsRef.current = new WebSocket(wsUrl);
    startTimeRef.current = Date.now();

    wsRef.current.onopen = () => {
      setFrameStats(prev => ({ ...prev, isConnected: true }));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        console.error('Stream error:', data.error);
        setFrameStats(prev => ({ ...prev, isConnected: false }));
        return;
      }

      setDetections(data.detections);
      setFrameStats(prev => ({
        ...prev,
        detectionCount: data.detections.length,
        frameCount: prev.frameCount + 1,
        uptime: Math.floor((Date.now() - startTimeRef.current) / 1000),
        avgConfidence: data.detections.length > 0
          ? (data.detections.reduce((sum, d) => sum + d.confidence, 0) / data.detections.length * 100).toFixed(1)
          : 0
      }));
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setFrameStats(prev => ({ ...prev, isConnected: false }));
    };

    wsRef.current.onclose = () => {
      setFrameStats(prev => ({ ...prev, isConnected: false }));
    };
  };

  const startMJPEGStream = (source) => {
    // Clean up source - remove any quotes that might be included
    const cleanSource = source.replace(/"/g, '').trim();
    setVideoSource(cleanSource);
    setFrameStats(prev => ({ ...prev, isConnected: true }));
    startTimeRef.current = Date.now();
  };

  const stopStream = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setFrameStats(prev => ({ ...prev, isConnected: false }));
    setDetections([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎥 OBJECT DETECTION</h1>
        <p>Real-time object detection with FastAPI & React</p>
      </header>

      <div className="app-container">
        <div className="main-content">
          <VideoStream
            connectionType={connectionType}
            isConnected={frameStats.isConnected}
            source={videoSource}
          />
          <Controls
            videoSource={videoSource}
            onVideoSourceChange={setVideoSource}
            onStartStream={startStream}
            onStopStream={stopStream}
            connectionType={connectionType}
            onConnectionTypeChange={setConnectionType}
            isStreaming={frameStats.isConnected}
          />
        </div>

        <Statistics frameStats={frameStats} />
        <DetectionsList detections={detections} />
      </div>
    </div>
  );
}

export default App;
