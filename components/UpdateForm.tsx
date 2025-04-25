'use client'

import { useState, useEffect } from 'react'


interface LandmarkUpdate {
    name: string;
}

interface UpdateFormProps {
    onMarkAsVisited: (id: number) => void;
    onUpdateLandmark: (id: number, updatedData: LandmarkUpdate) => void;
    onDeletePlan: (id: number) => void;
}

const UpdateForm = ({
    onMarkAsVisited,
    onUpdateLandmark,
    onDeletePlan,
}: UpdateFormProps) => {
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [plans, setPlans] = useState<{ id: number; name: string }[]>([]);
    const [landmarks, setLandmarks] = useState<{
        id: number;
        name: string;
        description: string;
        category: string;
        visited: boolean;
        plannedDate: Date;
        planId: number;
        latitude: number;
        longitude: number;
    }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editLandmark, setEditLandmark] = useState<null | {
        id: number;
        name: string;
    }>(null);

    const toggleForm = () => setIsFormVisible(!isFormVisible);

    const fetchPlansAndLandmarks = async () => {
        try {
            const plansResponse = await fetch('/api/plans');
            const plansData = await plansResponse.json();
            setPlans(plansData);
            console.log(plansData);

            const landmarksResponse = await fetch('/api/landmarks');
            const landmarksData = await landmarksResponse.json();
            setLandmarks(landmarksData);

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlansAndLandmarks();
    }, []);

    const handleDeletePlan = async (planId: number) => {
        const confirmed = confirm("Are you sure you want to delete this plan?");
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/plans/${planId}`, { method: 'DELETE' });

            if (response.ok) {
                console.log("Plan deleted successfully.");
                onDeletePlan(planId);
                fetchPlansAndLandmarks();
            } else {
                console.log("Failed to delete plan.");
            }
        } catch (error) {
            console.error("Error deleting plan:", error);
        }
    };


    const handleMarkAsVisited = async (landmarkId: number) => {
        const confirmed = confirm("Are you sure you want to mark this landmark as visited?");
        if (!confirmed) return;
        try {
            const response = await fetch('/api/visit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ landmarkId }),
            });

            if (response.ok) {
                console.log("Landmark marked as visited.");
                onMarkAsVisited(landmarkId);
                setLandmarks(prevLandmarks =>
                    prevLandmarks.map(landmark =>
                        landmark.id === landmarkId
                            ? { ...landmark, visited: true }
                            : landmark
                    )
                );
            } else {
                console.log("Failed to mark landmark as visited.");
            }
        } catch (error) {
            console.error("Error marking landmark as visited:", error);
        }
    };

    const handlePlanChange = async (selectedPlanId: number) => {
        setSelectedPlan(selectedPlanId);

        try {
            const response = await fetch(`/api/planItems?planId=${selectedPlanId}`);

            if (!response.ok) {
                console.error("Error fetching plan items:", response.status, await response.text());
                return;
            }

            const data = await response.json();
            setLandmarks(data);
        } catch (error) {
            console.error("Error during fetch:", error);
        }
    };

    const unvisitedLandmarks = landmarks.filter((landmark) => !landmark.visited);
    const visitedLandmarks = landmarks.filter((landmark) => landmark.visited);

    const openEditModal = (landmark: { id: number; name: string }) => {
        setEditLandmark(landmark);
        setIsModalOpen(true);
    };

    const handleModalSave = () => {
        if (editLandmark) {
            handleUpdateLandmark(editLandmark.id, { name: editLandmark.name });

            setLandmarks(prevLandmarks =>
                prevLandmarks.map(landmark =>
                    landmark.id === editLandmark.id
                        ? { ...landmark, name: editLandmark.name }
                        : landmark
                )
            );

            setIsModalOpen(false);
        }
    };

    const handleUpdateLandmark = async (id: number, updatedData: LandmarkUpdate) => {
        try {
            const res = await fetch(`/api/landmarks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error('Update failed');

            const data = await res.json();
            console.log('Updated:', data);

            onUpdateLandmark(id, updatedData);

        } catch (err) {
            console.error('Failed to update landmark', err);
        }
    };



    return (
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4 w-96 max-h-screen overflow-y-auto shadow-xl z-50 bg-black/20 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
                <button
                    onClick={toggleForm}
                    className="cursor-pointer active:scale-95 text-white hover:bg-neutral-700 bg-black/40 px-4 py-2 rounded-lg transition font-medium"
                >
                    {isFormVisible ? 'Close' : ' Update Settings '}
                </button>

                {isFormVisible && (
                    <div className="text-gray-900 border p-4 rounded-md shadow-xl space-y-4 bg-gray-50">
                        <div className="form-group">
                            <label htmlFor="plan-select" className="block text-sm font-medium">
                                Select Plan:
                            </label>
                            <select
                                id="plan-select"
                                value={selectedPlan || ''}
                                onChange={(e) => {
                                    const selectedId = Number(e.target.value);
                                    setSelectedPlan(selectedId);
                                    handlePlanChange(selectedId);
                                }}
                                className="border p-2 rounded w-full"
                            >
                                <option value="">Select Plan</option>
                                {plans.map((plan) => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name}
                                    </option>
                                ))}
                            </select>
                            {selectedPlan && (
                                <button
                                    onClick={() => handleDeletePlan(selectedPlan!)}
                                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full text-sm font-semibold"
                                >
                                    Delete Selected Plan
                                </button>
                            )}
                        </div>

                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            selectedPlan && (
                                <div>
                                    {unvisitedLandmarks.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold">Unvisited</h4>
                                            <ul>
                                                {unvisitedLandmarks.map((landmark) => (
                                                    <li key={landmark.id} className="border-b py-2">
                                                        <p><strong>{landmark.name}</strong></p>
                                                        <p>{landmark.description}</p>
                                                        <p>Planned Date: {new Date(landmark.plannedDate).toLocaleDateString()}</p>

                                                        <p>Category: {landmark.category}</p>
                                                        <p>{landmark.visited ? 'Visited' : 'Not Visited'}</p>

                                                        <div className="flex space-x-2 mt-2">
                                                            <button
                                                                onClick={() => handleMarkAsVisited(landmark.id)}
                                                                className="text-white bg-neutral-500 hover:bg-neutral-600 px-3 py-1.5 rounded-lg text-sm"
                                                            >
                                                                {landmark.visited ? 'Visited' : 'Mark as Visited'}
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    openEditModal({
                                                                        id: landmark.id,
                                                                        name: landmark.name,
                                                                    })
                                                                }
                                                                className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg text-sm"
                                                            >
                                                                Update
                                                            </button>

                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {visitedLandmarks.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold">Visited</h4>
                                            <ul>
                                                {visitedLandmarks.map((landmark) => (
                                                    <li key={landmark.id} className="border-b py-2">
                                                        <p><strong>{landmark.name}</strong></p>
                                                        <p>{landmark.description}</p>
                                                        <p>Planned Date: {new Date(landmark.plannedDate).toLocaleDateString()}</p>
                                                        <p>Category: {landmark.category}</p>
                                                        <p>{landmark.visited ? 'Visited' : 'Not Visited'}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && editLandmark && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-md shadow-xl space-y-4">
                        <h2 className="text-2xl font-bold text-black">Edit Landmark Name</h2>
                        <input
                            type="text"
                            value={editLandmark.name}
                            onChange={(e) =>
                                setEditLandmark({ ...editLandmark, name: e.target.value })
                            }
                            className="border p-2 rounded w-full text-black text-lg"
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={handleModalSave}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UpdateForm;
