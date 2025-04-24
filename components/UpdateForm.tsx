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

    const handleMarkAsVisited = (id: number) => onMarkAsVisited(id);
    const handleUpdateLandmark = (id: number, updates: LandmarkUpdate) =>
        onUpdateLandmark(id, updates);
    const handleDeleteLandmark = (id: number) => onDeleteLandmark(id);

    // Filter landmarks by selected plan
    const filteredLandmarks = selectedPlan
        ? landmarks.filter((landmark) => landmark.planId === selectedPlan)
        : landmarks;

    const handlePlanChange = async (selectedPlanId: number) => {
        setSelectedPlan(selectedPlanId); // Güncel plan ID'sini ayarla

        try {
            const response = await fetch(`/api/planItems?planId=${selectedPlanId}&visited=false`);

            if (!response.ok) {
                console.error("Error fetching plan items:", response.status, await response.text());
                return;
            }

            const data = await response.json();

            setLandmarks(data); // Gelen landmark verisini landmark state'ine setle
        } catch (error) {
            console.error("Error during fetch:", error);
        }
    };


    return (
        <div className="fixed top-1/2 left-0 transform -translate-y-1/2 p-4 w-96 max-h-screen overflow-y-auto shadow-lg z-50">
            <div className="flex flex-col space-y-4">
                <button
                    onClick={toggleForm}
                    className="cursor-pointer active:scale-95 text-neutral-1000 hover:bg-black bg-neutral-700 px-4 py-2 rounded-lg transition font-medium"
                >
                    Open Form
                </button>

                {isFormVisible && (
                    <div className="text-gray-900 border p-4 rounded-md shadow space-y-4 bg-gray-50">
                        <h2 className="font-medium text-xl">Landmark Update</h2>
                        <button
                            onClick={toggleForm}
                            className="text-white bg-red-600 px-4 py-2 rounded-lg transition font-medium mt-2"
                        >
                            Close
                        </button>

                        {/* Plan Selection */}
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
                            <div>
                                <h3 className="font-medium">Landmarks</h3>
                                {filteredLandmarks.length > 0 ? (
                                    <ul>
                                        {filteredLandmarks.map((landmark) => (
                                            <li key={landmark.id} className="border-b py-2">
                                                <p><strong>{landmark.name}</strong></p>
                                                <p>{landmark.description}</p>
                                                <p>Category: {landmark.category}</p>
                                                <p>{landmark.visited ? 'Visited' : 'Not Visited'}</p>

                                                <div className="flex space-x-2 mt-2">
                                                    <button
                                                        onClick={() => handleMarkAsVisited(landmark.id)}
                                                        className="cursor-pointer active:scale-95 text-white hover:bg-green-600 bg-green-500 px-4 py-2 rounded-lg transition font-medium"
                                                    >
                                                        {landmark.visited ? 'Visited' : 'Mark as Visited'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateLandmark(landmark.id, { name: landmark.name, description: landmark.description, category: landmark.category })}
                                                        className="cursor-pointer active:scale-95 text-white hover:bg-blue-600 bg-blue-500 px-4 py-2 rounded-lg transition font-medium"
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLandmark(landmark.id)}
                                                        className="cursor-pointer active:scale-95 text-white hover:bg-red-600 bg-red-500 px-4 py-2 rounded-lg transition font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No landmarks found for this plan.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateForm;
