import React from 'react';

function Statistics({ frameStats }) {
  return (
    <div className="statistics-container">
      <h2>📊 Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{frameStats.detectionCount}</div>
          <div className="stat-label">Objects Detected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{frameStats.avgConfidence}%</div>
          <div className="stat-label">Avg Confidence</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{frameStats.fps}</div>
          <div className="stat-label">FPS</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{frameStats.uptime}s</div>
          <div className="stat-label">Uptime</div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
