import React from 'react';

function DetectionsList({ detections }) {
  return (
    <div className="detections-container">
      <h2>🎯 Current Detections</h2>
      <div className="detections-list">
        {detections.length === 0 ? (
          <p className="no-detections">No detections yet...</p>
        ) : (
          detections.map((detection, idx) => (
            <div key={idx} className="detection-item">
              <div className="detection-class">{detection.class}</div>
              <div className="detection-confidence">
                {(detection.confidence * 100).toFixed(1)}%
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DetectionsList;
