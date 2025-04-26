'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Sidebar from './Sidebar';
import PlansBar from './PlansBar';
import LandmarkEditBar from './LandmarkEditBar';

interface Location {
  id: number;
  position: [number, number];
  name: string;
  visit_date?: string;
  category?: string;
  description?: string;
  is_visited: boolean;
}

// Create a custom numbered marker icon
const createNumberedIcon = (
  number: number,
  isViewMode: boolean = false,
  isVisited: boolean = false
) => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="
      background-color: ${
        isVisited ? '#10B981' : isViewMode ? '#2563eb' : '#4CAF50'
      };
      width: ${isVisited ? '34px' : '30px'};
      height: ${isVisited ? '34px' : '30px'};
      border-radius: ${isVisited ? '4px' : '50%'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      transform: ${isVisited ? 'rotate(45deg)' : 'none'};
    "><span style="transform: ${
      isVisited ? 'rotate(-45deg)' : 'none'
    }">${number}</span></div>`,
    iconSize: [isVisited ? 34 : 30, isVisited ? 34 : 30],
  });
};

// Add a component to fit bounds when landmarks change
function BoundsUpdater({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = new L.LatLngBounds(locations.map((loc) => loc.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

interface MapEventsProps {
  onLocationClick: (position: [number, number]) => void;
}

function MapEvents({ onLocationClick }: MapEventsProps) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationClick([lat, lng]);
    },
  });
  return null;
}

export default function Map() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [viewLocations, setViewLocations] = useState<Location[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPlansBarOpen, setIsPlansBarOpen] = useState(false);
  const [isEditBarOpen, setIsEditBarOpen] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<Location | null>(
    null
  );
  const [planName, setPlanName] = useState('');
  const [isViewMode, setIsViewMode] = useState(false);

  const handleLocationClick = useCallback(
    (position: [number, number]) => {
      if (!isViewMode) {
        setLocations((prev) => [
          ...prev,
          { id: Date.now(), position, name: '', is_visited: false },
        ]);
        setIsSidebarOpen(true);
        setIsPlansBarOpen(false);
      }
    },
    [isViewMode]
  );

  const handleLocationNameChange = useCallback(
    (position: [number, number], name: string) => {
      setLocations((prev) =>
        prev.map((loc) =>
          loc.position[0] === position[0] && loc.position[1] === position[1]
            ? { ...loc, name }
            : loc
        )
      );
    },
    []
  );

  const handleLocationDateChange = useCallback(
    (position: [number, number], date: string) => {
      setLocations((prev) =>
        prev.map((loc) =>
          loc.position[0] === position[0] && loc.position[1] === position[1]
            ? { ...loc, visit_date: date }
            : loc
        )
      );
    },
    []
  );

  const handleFinish = useCallback(() => {
    setLocations([]);
    setPlanName('');
    setIsSidebarOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    setLocations([]);
    setPlanName('');
    setIsSidebarOpen(false);
  }, []);

  const handlePlanSelect = useCallback(async (planId: number) => {
    try {
      const response = await fetch(`/api/plans/${planId}/landmarks`);
      if (!response.ok) {
        throw new Error('Failed to fetch landmarks');
      }
      const landmarks = await response.json();
      const landmarksWithPosition = landmarks.map(
        (landmark: {
          latitude: number;
          longitude: number;
          is_visited: boolean;
        }) => ({
          ...landmark,
          position: [landmark.latitude, landmark.longitude],
          is_visited: landmark.is_visited,
        })
      );
      console.log('landmarksWithPosition', landmarksWithPosition);
      setViewLocations(landmarksWithPosition);
      setIsViewMode(true);
      setIsPlansBarOpen(false);
    } catch (error) {
      console.error('Error loading landmarks:', error);
    }
  }, []);

  const handleExitViewMode = useCallback(() => {
    setViewLocations([]);
    setIsViewMode(false);
  }, []);

  const handleLocationDelete = useCallback((position: [number, number]) => {
    setLocations((prev) =>
      prev.filter(
        (loc) =>
          loc.position[0] !== position[0] || loc.position[1] !== position[1]
      )
    );
  }, []);

  const handleLandmarkClick = useCallback(
    (landmark: Location) => {
      if (isViewMode) {
        setSelectedLandmark(landmark);
        setIsEditBarOpen(true);
      }
    },
    [isViewMode]
  );

  const handleLandmarkUpdate = useCallback(
    async (landmarkId: number, data: Partial<Location>) => {
      try {
        const response = await fetch(`/api/landmarks/${landmarkId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            visit_date: data.visit_date,
            category: data.category,
            description: data.description,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update landmark');
        }

        const updatedLandmark = await response.json();
        setViewLocations((prev) =>
          prev.map((loc) =>
            loc.id === landmarkId
              ? {
                  ...loc,
                  ...updatedLandmark,
                  position: [
                    updatedLandmark.latitude,
                    updatedLandmark.longitude,
                  ],
                }
              : loc
          )
        );
      } catch (error) {
        console.error('Error updating landmark:', error);
      }
    },
    []
  );

  const handleLandmarkDelete = useCallback(async (landmarkId: number) => {
    try {
      const response = await fetch(`/api/landmarks/${landmarkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete landmark');
      }

      setViewLocations((prev) => prev.filter((loc) => loc.id !== landmarkId));
    } catch (error) {
      console.error('Error deleting landmark:', error);
    }
  }, []);

  const handleToggleVisited = useCallback(
    async (landmarkId: number) => {
      try {
        // Find the current landmark's visited status from viewLocations
        const currentLandmark = viewLocations.find(
          (loc) => loc.id === landmarkId
        );
        if (!currentLandmark) return;

        const response = await fetch(`/api/landmarks/${landmarkId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: currentLandmark.name,
            is_visited: !currentLandmark.is_visited,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to toggle landmark visited status');
        }

        const updatedLandmark = await response.json();
        setViewLocations((prev) =>
          prev.map((loc) =>
            loc.id === landmarkId
              ? {
                  ...loc,
                  ...updatedLandmark,
                  position: [
                    updatedLandmark.latitude,
                    updatedLandmark.longitude,
                  ],
                }
              : loc
          )
        );
      } catch (error) {
        console.error('Error toggling landmark visited status:', error);
      }
    },
    [viewLocations]
  );

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* My Plans Button - Only show when no sidebar is open and not in view mode */}
      {!isSidebarOpen && !isPlansBarOpen && !isViewMode && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <button
            className="bg-white px-8 py-4 rounded-full shadow-lg border border-gray-200 text-sm font-medium uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95 duration-300"
            onClick={() => setIsPlansBarOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
              />
            </svg>
            My Plans
          </button>
        </div>
      )}

      {/* Exit View Mode Button */}
      {isViewMode && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <button
            className="bg-white px-8 py-4 rounded-full shadow-lg border border-gray-200 text-sm font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center gap-2"
            onClick={handleExitViewMode}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            Back to Map
          </button>
        </div>
      )}

      <MapContainer
        center={[41.0082, 28.9784]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onLocationClick={handleLocationClick} />
        {(isViewMode ? viewLocations : locations).map((location, index) => (
          <Marker
            key={`${location.position[0]}-${location.position[1]}`}
            position={location.position}
            icon={createNumberedIcon(
              index + 1,
              isViewMode,
              location.is_visited
            )}
            eventHandlers={{
              click: () => handleLandmarkClick(location),
            }}
          >
            <Popup>
              <div className="font-medium">
                {location.name || `Location ${index + 1}`}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {location.category && (
                  <div className="font-medium text-blue-600">
                    {location.category}
                  </div>
                )}
                {location.description && (
                  <div className="mt-1">{location.description}</div>
                )}
                {location.visit_date && (
                  <div className="mt-1">
                    Visit Date:{' '}
                    {new Date(location.visit_date).toLocaleDateString()}
                  </div>
                )}
                {location.is_visited && (
                  <div className="mt-1 flex items-center gap-1 text-green-600 font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Visited
                  </div>
                )}
                <div className="mt-1">
                  {location.position[0].toFixed(6)},{' '}
                  {location.position[1].toFixed(6)}
                </div>
              </div>
              {isViewMode && (
                <button
                  onClick={() => handleLandmarkClick(location)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit Details
                </button>
              )}
            </Popup>
          </Marker>
        ))}
        <BoundsUpdater locations={isViewMode ? viewLocations : locations} />
      </MapContainer>

      <Sidebar
        isOpen={isSidebarOpen}
        locations={locations}
        onLocationNameChange={handleLocationNameChange}
        onLocationDateChange={handleLocationDateChange}
        onFinish={handleFinish}
        onCancel={handleCancel}
        planName={planName}
        onPlanNameChange={setPlanName}
        onLocationDelete={handleLocationDelete}
      />

      <PlansBar
        isOpen={isPlansBarOpen}
        onClose={() => setIsPlansBarOpen(false)}
        onPlanSelect={handlePlanSelect}
      />

      <LandmarkEditBar
        isOpen={isEditBarOpen}
        onClose={() => {
          setIsEditBarOpen(false);
          setSelectedLandmark(null);
        }}
        landmark={selectedLandmark}
        onUpdate={handleLandmarkUpdate}
        onDelete={handleLandmarkDelete}
        onToggleVisited={handleToggleVisited}
      />
    </div>
  );
}
