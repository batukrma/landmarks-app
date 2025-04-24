import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MapOverlayMenu from './MapOverlayMenu'
import LandmarkTable from './LandmarkTable'
import PlansTable from './PlansTable'
import UpdateForm from './UpdateForm';


interface LandmarkUpdate {
    name: string;
}


// Leaflet marker icons fix
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

interface PlanItem {
    id: number;
    plannedDate: string;
    visited: boolean;
    color: string;
    landmark: Landmark;
    plan_id?: number;
}

interface VisitingPlan {
    id: number;
    items: PlanItem[];
}

interface VisitedLandmark {
    id: number
    visited_date: string
    plannedDate?: string
    plan_id?: number
    visitor_name: string
    landmark: Landmark
    color: string
}




export default function MapSelector({ onLocationSelect }: MapSelectorProps) {
    const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)
    const [visitedLandmarks, setVisitedLandmarks] = useState<VisitedLandmark[]>([])
    const [showPlansTable, setShowPlansTable] = useState(false)
    const [landmarks, setLandmarks] = useState<Landmark[]>([])
    const [visitingPlans, setVisitingPlans] = useState<VisitedLandmark[]>([])

    const handleMarkAsVisited = (id: number) => {
        console.log(`Marking landmark with id ${id} as visited`);
    };

    const handleUpdateLandmark = (id: number, updatedData: LandmarkUpdate) => {
        console.log(`Updating landmark with id ${id}`, updatedData);
        setLandmarks((prevLandmarks) =>
            prevLandmarks.map((landmark) =>
                landmark.id === id ? { ...landmark, ...updatedData } : landmark
            )
        );
    };

    const handleDeleteLandmark = (id: number) => {
        console.log(`Deleting landmark with id ${id}`);
    };

    useEffect(() => {
        const storedVisitedLandmarks = localStorage.getItem('visitedLandmarks')
        if (storedVisitedLandmarks) {
            setVisitedLandmarks(JSON.parse(storedVisitedLandmarks))
        }
    }, [])

    const fetchLandmarks = async () => {
        try {
            const res = await fetch('/api/landmarks')
            const data: Landmark[] = await res.json()
            setLandmarks(data)
        } catch (error) {
            console.error('Failed to fetch landmarks:', error)
        }
    }

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

    const handleGetPlans = async () => {
        try {
            const response = await fetch('/api/plans');
            const data: VisitingPlan[] = await response.json();

            const allItems = data.flatMap((plan) =>
                plan.items.map((item) => ({
                    ...item,
                    plan_id: plan.id,
                    color: item.color,
                    visited_date: item.visited ? new Date().toISOString() : '',
                    visitor_name: item.visited ? 'Visitor Name' : '',
                }))
            );

            setVisitingPlans(allItems as VisitedLandmark[]);
            console.log('Planned landmarks:', allItems);
        } catch (error) {
            console.error('Error fetching planned landmarks:', error);
        }
    };

    function handleClearMarkers(): void {
        return setVisitedLandmarks([]), setVisitingPlans([])
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

                {visitingPlans.map((plan) => (
                    <Marker
                        key={`plan-${plan.id}`}
                        position={[plan.landmark.latitude, plan.landmark.longitude]}
                        icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: `<div style='background:${plan.color};border-radius:50%;width:20px;height:20px;'></div>`,
                        })}
                    >
                        <Popup>
                            <strong>{plan.landmark.name}</strong><br />
                            {plan.landmark.description}<br />
                            Category: {plan.landmark.category}<br />
                            Planned by: {'Batuhan Kırma'}<br />
                            Planned Date: {plan.plannedDate ? new Date(plan.plannedDate).toLocaleDateString() : 'Not Available'}
                        </Popup>
                    </Marker>
                ))}

                <LocationMarker />
            </MapContainer>

            <MapOverlayMenu
                myPlans={handleGetPlans}
                onClearMarkers={handleClearMarkers}
                visitedLandmarks={visitedLandmarks.map((vl) => ({
                    id: vl.id,
                    name: vl.landmark.name,
                    description: vl.landmark.description,
                    category: vl.landmark.category,
                    visitor_name: vl.visitor_name,
                }))}
                setShowPlansTable={(val: boolean) => {
                    if (val) fetchLandmarks();
                    setShowPlansTable(val);
                }}
            />
            <UpdateForm
                onMarkAsVisited={handleMarkAsVisited}
                onUpdateLandmark={handleUpdateLandmark}
                onDeletePlan={handleDeleteLandmark}
            />

            <LandmarkTable
                selectedLandmark={selectedPosition ? selectedPosition : [0, 0]}
            />
            <PlansTable
                show={showPlansTable}
                onClose={() => setShowPlansTable(false)}
                landmarks={landmarks}
            />

            {selectedPosition && (
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/60 text-white px-6 py-2 rounded-full shadow-md text-sm font-medium">
                    {selectedPosition[0].toFixed(5)}, {selectedPosition[1].toFixed(5)}
                </div>
            )}
        </div>
    )
}
