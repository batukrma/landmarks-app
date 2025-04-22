'use client'

interface MapOverlayMenuProps {
    onAddNote: () => void;
    onGetVisited: () => void;
    createPlan: () => void;
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
    visitedLandmarks,
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
                    onClick={onGetVisited}  // Butona tıklayınca ziyaret edilen yerleri getir
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
            </div>
            <div className="absolute bg-black bottom-1/2 sw-full transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded-lg">
                <table className="min-w-full text-center">
                    <thead>
                        <tr>
                            <th className="text-left px-4 py-2">Name</th>
                            <th className="text-left px-4 py-2">Description</th>
                            <th className="text-left px-4 py-2">Category</th>
                            <th className="text-left px-4 py-2">Visitor</th>
                        </tr>
                    </thead>
                    <tbody className="flex flex-col">
                        {visitedLandmarks.map((landmark, index) => (
                            <tr key={landmark.id} className="flex flex-col">
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        value={landmark.name}
                                        onChange={(e) => {
                                            const updatedLandmarks = [...visitedLandmarks];
                                            updatedLandmarks[index].name = e.target.value;
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        value={landmark.description}
                                        onChange={(e) => {
                                            const updatedLandmarks = [...visitedLandmarks];
                                            updatedLandmarks[index].description = e.target.value;
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        value={landmark.category}
                                        onChange={(e) => {
                                            const updatedLandmarks = [...visitedLandmarks];
                                            updatedLandmarks[index].category = e.target.value;
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        value={landmark.visitor_name}
                                        onChange={(e) => {
                                            const updatedLandmarks = [...visitedLandmarks];
                                            updatedLandmarks[index].visitor_name = e.target.value;
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
