'use client';

import { useState } from 'react';

interface MapOverlayProps {
  markerPosition: [number, number] | null;
}

export default function MapOverlay({ markerPosition }: MapOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        borderRadius: '8px',
        padding: isExpanded ? '20px' : '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: isExpanded ? '300px' : 'auto',
        transition: 'all 0.3s ease',
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: '18px',
        }}
      >
        {isExpanded ? '×' : '☰'}
      </button>

      {isExpanded && (
        <div>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
            Location Details
          </h2>

          {markerPosition ? (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Latitude
                </label>
                <input
                  type="text"
                  value={markerPosition[0].toFixed(6)}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Longitude
                </label>
                <input
                  type="text"
                  value={markerPosition[1].toFixed(6)}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <button
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Save Location
              </button>
            </div>
          ) : (
            <p style={{ color: '#666' }}>
              Click on the map to select a location
            </p>
          )}
        </div>
      )}
    </div>
  );
}
