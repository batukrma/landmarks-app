'use client'

interface MapOverlayMenuProps {
    onAddNote: () => void;
    onGetVisited: () => void;
    createPlan: () => void;
    onClearMarkers: () => void;
    visitedLandmarks: {
        id: number;
        name: string;
        description: string;
        category: string;
        visitor_name: string;
    }[];
}

export default function MapOverlayMenu({
    onAddNote,
    onGetVisited,
    createPlan,
    onClearMarkers,
}: MapOverlayMenuProps) {
    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex gap-4 bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
                <button
                    onClick={onAddNote}
                    className="cursor-pointer active:scale-95 text-white hover:bg-neutral-700 bg-black/40 px-4 py-2 rounded-lg transition font-medium"
                >
                    Add Notes
                </button>
                <button
                    onClick={onGetVisited}
                    className="cursor-pointer active:scale-95 text-white hover:bg-neutral-700 bg-black/40 px-4 py-2 rounded-lg transition font-medium"
                >
                    Get Visited Places
                </button>
                <button
                    onClick={createPlan}
                    className="cursor-pointer active:scale-95 text-white hover:bg-neutral-700 bg-black/40 px-4 py-2 rounded-lg transition font-medium"
                >
                    Create Plan
                </button>
                <button
                    onClick={onClearMarkers}
                    className="cursor-pointer active:scale-95 text-white hover:bg-neutral-700 bg-black/40 px-4 py-2 rounded-lg transition font-medium"
                >
                    Clear Markers
                </button>

            </div>

        </div>
    )
}
