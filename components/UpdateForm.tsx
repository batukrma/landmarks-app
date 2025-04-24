'use client'

import { useState, useEffect } from 'react'

interface LandmarkUpdate {
    name: string;
}

interface UpdateFormProps {
    onMarkAsVisited: (id: number) => void;
    onDeleteLandmark: (id: number) => void;
}

const UpdateForm = ({
    onMarkAsVisited,
    onDeleteLandmark,
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
        planId: number;
    }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal için yeni state'ler
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

    const handleDeleteLandmark = (id: number) => onDeleteLandmark(id);

    const handleMarkAsVisited = async (landmarkId: number) => {
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

            // UI'de güncelleme
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
                                                            <button
                                                                onClick={() => handleDeleteLandmark(landmark.id)}
                                                                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm"
                                                            >
                                                                Delete
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
                                                        <p>Category: {landmark.category}</p>

                                                        <div className="flex space-x-2 mt-2">
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
                                                            <button
                                                                onClick={() => handleDeleteLandmark(landmark.id)}
                                                                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
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
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold">Edit Landmark</h2>
                        <div className="space-y-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium">Name:</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={editLandmark.name}
                                    onChange={(e) =>
                                        setEditLandmark({ ...editLandmark, name: e.target.value })
                                    }
                                    className="border p-2 w-full rounded"
                                />
                            </div>

                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleModalSave}
                                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UpdateForm;
