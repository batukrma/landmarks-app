'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapOverlayMenu from './MapOverlayMenu'

// Leaflet varsayılan ikonlarını düzeltme
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

interface Landmark {
    id: number
    name: string
    latitude: number
    longitude: number
    description: string
    category: string
}

interface VisitedLandmark {
    id: number
    visited_date: string
    visitor_name: string
    landmark: Landmark
}

interface ApiVisitedLandmark {
    id: number
    landmark_id: number
    visited_date: string
    visitor_name: string
    landmarks: {
        id: number
        name: string
        latitude: string
        longitude: string
        description: string
        category: string
    }
}

export default function MapSelector({ onLocationSelect }: MapSelectorProps) {
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)
    const [visitedLandmarks, setVisitedLandmarks] = useState<VisitedLandmark[]>([])

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

    async function getMessage() {
        try {
            const res = await fetch('/api/landmarks')
            const data = await res.json()
            console.log('API Response:', data)
        } catch (err) {
            console.error('Failed to fetch landmarks:', err)
        }
    }

    const handleGetVisited = async () => {
        try {
            const res = await fetch('/api/visited')
            const data: ApiVisitedLandmark[] = await res.json()

            const transformed: VisitedLandmark[] = data.map((item) => ({
                id: item.id,
                visited_date: item.visited_date,
                visitor_name: item.visitor_name,
                landmark: {
                    id: item.landmarks.id,
                    name: item.landmarks.name,
                    latitude: parseFloat(item.landmarks.latitude),
                    longitude: parseFloat(item.landmarks.longitude),
                    description: item.landmarks.description,
                    category: item.landmarks.category,
                },
            }))

            setVisitedLandmarks(transformed)
        } catch (error) {
            console.error('Failed to fetch visited landmarks:', error)
        }
    }

    function createPlan(): void {
        throw new Error('Function not implemented.')
    }

    return (
        <div className="fixed inset-0">
            <MapContainer
                center={[37.16335, 28.38753]}
                zoom={20}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Ziyaret edilmiş konumları haritada göster */}
                {visitedLandmarks.map((vl) => (
                    <Marker
                        key={vl.id}
                        position={[vl.landmark.latitude, vl.landmark.longitude]}
                    >
                        <Popup>
                            <strong>{vl.landmark.name}</strong><br />
                            {vl.landmark.description}<br />
                            Category: {vl.landmark.category}<br />
                            Visited by: {vl.visitor_name}
                        </Popup>
                    </Marker>
                ))}

                {/* Kullanıcının tıkladığı konumu göster */}
                <LocationMarker />
            </MapContainer>

            {/* Sağ üstteki overlay menü */}
            <MapOverlayMenu
                onAddNote={getMessage}
                onGetVisited={handleGetVisited}
                createPlan={createPlan}
                visitedLandmarks={visitedLandmarks.map((vl) => ({
                    id: vl.id,
                    name: vl.landmark.name,
                    description: vl.landmark.description,
                    category: vl.landmark.category,
                    visitor_name: vl.visitor_name,
                }))}
            />

            {/* Tıklanan konum alt bilgi */}
            {selectedPosition && (
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/60 text-white px-6 py-2 rounded-full shadow-md text-sm font-medium">
                    Selected: {selectedPosition[0].toFixed(5)}, {selectedPosition[1].toFixed(5)}
                </div>
            )}
        </div>
    )
}
