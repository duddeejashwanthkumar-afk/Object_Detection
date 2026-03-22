import React, { useState } from 'react';

function Controls({ videoSource, onVideoSourceChange, onStartStream, onStopStream, connectionType, onConnectionTypeChange, isStreaming }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleStartStream = () => {
    onStartStream(videoSource);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/detect/image', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log('Detection result:', data);
    } catch (error) {
      alert('Error uploading image: ' + error);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedVideo) {
      alert('Please select a video file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedVideo);

    try {
      const response = await fetch('/detect/video/file', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      alert('Video processed: ' + data.output_file);
    } catch (error) {
      alert('Error processing video: ' + error);
    }
  };

  return (
    <div className="controls-container">
      <div className="control-section">
        <h3>Stream Controls</h3>

        <div className="control-group">
          <label>Connection Type</label>
          <select
            value={connectionType}
            onChange={(e) => onConnectionTypeChange(e.target.value)}
            disabled={isStreaming}
          >
            <option value="websocket">WebSocket (Recommended)</option>
            <option value="mjpeg">MJPEG Stream</option>
          </select>
        </div>

        <div className="control-group">
          <label>Video Source</label>
          <input
            type="text"
            value={videoSource}
            onChange={(e) => onVideoSourceChange(e.target.value)}
            placeholder="0 for webcam or file path"
            disabled={isStreaming}
          />
        </div>

        <div className="button-group">
          <button
            onClick={handleStartStream}
            className="btn btn-primary"
            disabled={isStreaming}
          >
            ▶ Start Stream
          </button>
          <button
            onClick={onStopStream}
            className="btn btn-danger"
            disabled={!isStreaming}
          >
            ⏹ Stop Stream
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Image Upload</h3>
        <div className="control-group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="control-section">
        <h3>Video Upload</h3>
        <div className="control-group">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setSelectedVideo(e.target.files[0])}
          />
          <button
            onClick={handleVideoUpload}
            className="btn btn-primary"
          >
            📹 Process Video
          </button>
        </div>
      </div>
    </div>
  );
}

export default Controls;
