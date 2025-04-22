'use client'

interface MapOverlayMenuProps {
    onAddNote?: () => void
    onGetVisited?: () => void
}

export default function MapOverlayMenu({
    onAddNote,
    onGetVisited,
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
            </div>
        </div>
    )
}
