'use client'

import { useState, useEffect } from 'react'

interface LandmarkUpdate {
    name: string;
    description: string;
    category: string;
    visited?: boolean; // Updated to include the visited property
}

interface UpdateFormProps {
    onMarkAsVisited: (id: number) => void;
    onUpdateLandmark: (id: number, updatedData: LandmarkUpdate) => void;
    onDeleteLandmark: (id: number) => void;
}

const UpdateForm = ({
    onMarkAsVisited,
    onUpdateLandmark,
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
        planId: number; // Add planId to filter landmarks by plan
    }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const toggleForm = () => setIsFormVisible(!isFormVisible);

    const fetchPlansAndLandmarks = async () => {
        try {
            // Fetch plans data
            const plansResponse = await fetch('/api/plans');
            const plansData = await plansResponse.json();
            setPlans(plansData);

            // Fetch landmarks data
            const landmarksResponse = await fetch('/api/landmarks');
            const landmarksData = await landmarksResponse.json();
            setLandmarks(landmarksData);

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false); // Set loading to false in case of error
        }
    };

    useEffect(() => {
        fetchPlansAndLandmarks();
    }, []); // Runs only once when the component is mounted

    const handleUpdateLandmark = (id: number, updates: LandmarkUpdate) =>
        onUpdateLandmark(id, updates);
    const handleDeleteLandmark = (id: number) => onDeleteLandmark(id);

    // Handle marking landmark as visited
    const handleMarkAsVisited = async (landmarkId: number) => {
        try {
            const response = await fetch('/api/visit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ landmarkId }), // Landmark ID'yi body olarak gönder
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
                                    <h3 className="font-medium"></h3>
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
                                                                className="cursor-pointer active:scale-95 text-white hover:bg-neutral-600 bg-neutral-500 px-3 py-1.5 rounded-lg transition font-medium text-sm"
                                                            >
                                                                {landmark.visited ? 'Visited' : 'Mark as Visited'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateLandmark(landmark.id, { name: landmark.name, description: landmark.description, category: landmark.category })}
                                                                className="cursor-pointer active:scale-95 text-white hover:bg-blue-600 bg-blue-500 px-3 py-1.5 rounded-lg transition font-medium text-sm"
                                                            >
                                                                Update
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLandmark(landmark.id)}
                                                                className="cursor-pointer active:scale-95 text-white hover:bg-red-600 bg-red-500 px-3 py-1.5 rounded-lg transition font-medium text-sm"
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
                                                        <p>{landmark.visited ? 'Visited' : 'Not Visited'}</p>

                                                        <div className="flex space-x-2 mt-2">
                                                            <button
                                                                onClick={() => handleUpdateLandmark(landmark.id, { name: landmark.name, description: landmark.description, category: landmark.category })}
                                                                className="cursor-pointer active:scale-95 text-white hover:bg-blue-600 bg-blue-500 px-3 py-1.5 rounded-lg transition font-medium text-sm"
                                                            >
                                                                Update
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLandmark(landmark.id)}
                                                                className="cursor-pointer active:scale-95 text-white hover:bg-red-600 bg-red-500 px-3 py-1.5 rounded-lg transition font-medium text-sm"
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
        </div>
    );
}

export default UpdateForm;
