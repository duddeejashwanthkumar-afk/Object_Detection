import React, { useEffect, useRef } from 'react';

function VideoStream({ connectionType, isConnected, source }) {
  const wsRef = useRef(null);

  useEffect(() => {
    const currentWs = wsRef.current;
    return () => {
      if (currentWs) {
        currentWs.close();
      }
    };
  }, []);

  return (
    <div className="video-container">
      {isConnected ? (
        connectionType === 'websocket' ? (
          <WebSocketVideoStream source={source} />
        ) : (
          <MJPEGVideoStream source={source} />
        )
      ) : (
        <div className="video-placeholder">
          <div className="placeholder-content">
            <span>📹</span>
            <p>Click "Start Stream" to begin</p>
          </div>
        </div>
      )}
    </div>
  );
}

function WebSocketVideoStream({ source }) {
  const [frame, setFrame] = React.useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendUrl = process.env.REACT_APP_API_URL || window.location.host;
    const cleanSource = source.replace(/"/g, '').trim();

    wsRef.current = new WebSocket(`${wsProtocol}//${backendUrl}/ws/video?source=${encodeURIComponent(cleanSource)}`);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.frame) {
        setFrame(`data:image/jpeg;base64,${data.frame}`);
      }
    };

    const currentWs = wsRef.current;
    return () => {
      if (currentWs) {
        currentWs.close();
      }
    };
  }, [source]);

  return (
    <>
      {frame && <img src={frame} alt="Stream" className="video-stream" />}
    </>
  );
}

function MJPEGVideoStream({ source }) {
  const cleanSource = source.replace(/"/g, '').trim();
  return (
    <img
      src={`/detect/video/stream?source=${encodeURIComponent(cleanSource)}`}
      alt="Stream"
      className="video-stream"
    />
  );
}

export default VideoStream;
