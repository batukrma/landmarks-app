'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapOverlayMenu from './MapOverlayMenu' // ← NEW IMPORT

// eslint-disable-next-line
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapSelectorProps {
    onLocationSelect?: (lat: number, lng: number) => void
}

export default function MapSelector({ onLocationSelect }: MapSelectorProps) {
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)

    function LocationMarker() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng
                setSelectedPosition([lat, lng])
                onLocationSelect?.(lat, lng)
            },
        })

        return selectedPosition ? <Marker position={selectedPosition} /> : null
    }

    // Example GET request to /api/landmarks
    async function getMessage() {
        await fetch('/api/landmarks')
            .then((res) => res.json())
            .then((data) => {
                console.log('API Response:', data)
            })
            .catch((err) => {
                console.error('Failed to fetch landmarks:', err)
            })
    }

    return (
        <div className="fixed inset-0">
            <MapContainer
                center={[38.4237, 27.1428]}
                zoom={5}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
            </MapContainer>

            <MapOverlayMenu
                onAddNote={getMessage}
                onGetVisited={() => console.log('Get Visited Places clicked')}
            />

            {selectedPosition && (
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/60 text-white px-6 py-2 rounded-full shadow-md text-sm font-medium">
                    Selected: {selectedPosition[0].toFixed(5)}, {selectedPosition[1].toFixed(5)}
                </div>
            )}
        </div>
    )
}
