import { useState } from 'react';

interface LandmarkInput {
    id: number;
    name: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
}

export default function LandmarkTable() {
    const [landmarkInputs, setLandmarkInputs] = useState<LandmarkInput[]>([]);
    const [isTableOpen, setIsTableOpen] = useState(false);

    const handleAddLandmark = (latitude: number, longitude: number) => {
        setIsTableOpen(true);
        const exists = landmarkInputs.some(
            (landmark) => landmark.latitude === latitude && landmark.longitude === longitude
        );

        if (exists) {
            setLandmarkInputs((prevInputs) =>
                prevInputs.map((landmark) =>
                    landmark.latitude === latitude && landmark.longitude === longitude
                        ? { ...landmark, latitude, longitude }
                        : landmark
                )
            );
        } else {
            setLandmarkInputs((prevInputs) => [
                ...prevInputs,
                {
                    id: prevInputs.length + 1,
                    name: '',
                    description: '',
                    category: '',
                    latitude,
                    longitude,
                },
            ]);
        }
    };

    const handleChange = (index: number, field: keyof LandmarkInput, value: string | number) => {
        const updatedInputs = [...landmarkInputs];
        updatedInputs[index] = {
            ...updatedInputs[index],
            [field]: value,
        };
        setLandmarkInputs(updatedInputs);
    };

    const handleSave = async (index: number) => {
        const landmark = landmarkInputs[index];

        // Form doğrulaması
        if (!landmark.name || !landmark.description || !landmark.category) {
            alert("Lütfen tüm alanları doldurun!");
            return;
        }

        try {
            const response = await fetch('/api/landmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: landmark.name,
                    latitude: landmark.latitude,
                    longitude: landmark.longitude,
                    description: landmark.description,
                    category: landmark.category,
                }),
            });

            if (response.ok) {
                const savedLandmark = await response.json();
                console.log('Saved Landmark:', savedLandmark);
                setIsTableOpen(false); // Table'ı kapatma
                setLandmarkInputs([]); // Girdi alanlarını sıfırlama
            } else {
                console.error('Failed to save landmark');
            }
        } catch (error) {
            console.error('Error saving landmark:', error);
        }
    };



    const handleClose = () => {
        setIsTableOpen(false);
        setLandmarkInputs([]);
    };

    return (
        <div className="fixed top-1/2 right-0 transform -translate-y-1/2 p-4 w-96 max-h-screen overflow-y-auto shadow-lg z-50">
            <div className="flex flex-col space-y-4">
                {!isTableOpen && (
                    <button
                        onClick={() => handleAddLandmark(37.16336, 28.38753)}
                        className="cursor-pointer active:scale-95 text-neutral-1000 hover:bg-black bg-neutral-700 px-4 py-2 rounded-lg transition font-medium"
                    >
                        Add Landmark
                    </button>
                )}
                <div className="flex flex-col space-y-6">
                    {landmarkInputs.map((landmark, index) => (
                        <div key={landmark.id} className="text-gray-900 border p-4 rounded-md shadow space-y-2 bg-gray-50">
                            <div>
                                <label className="block text font-medium">Name</label>
                                <input
                                    type="text"
                                    value={landmark.name}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    className="border p-1 rounded w-full "
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <input
                                    type="text"
                                    value={landmark.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    className="border p-1 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Category</label>
                                <select
                                    value={landmark.category}
                                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                                    className="border p-1 rounded w-full"
                                >
                                    <option value="Museum">Museum</option>
                                    <option value="Historical Site">Historical Site</option>
                                    <option value="Nature Reserve">Nature Reserve</option>
                                    <option value="Park">Park</option>
                                    <option value="Beach">Beach</option>
                                    <option value="Waterfall">Waterfall</option>
                                    <option value="Mountain">Mountain</option>
                                    <option value="Hiking Trail">Hiking Trail</option>
                                    <option value="Botanical Garden">Botanical Garden</option>
                                    <option value="Zoo">Zoo</option>
                                    <option value="Art Gallery">Art Gallery</option>
                                    <option value="Monument">Monument</option>
                                    <option value="Cultural Center">Cultural Center</option>
                                    <option value="Amusement Park">Amusement Park</option>
                                    <option value="Historic Castle">Historic Castle</option>
                                    <option value="Archaeological Site">Archaeological Site</option>
                                    <option value="Other">Other</option>


                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Latitude</label>
                                <input
                                    type="text"
                                    value={landmark.latitude}
                                    readOnly
                                    className="border p-1 rounded w-full bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Longitude</label>
                                <input
                                    type="text"
                                    value={landmark.longitude}
                                    readOnly
                                    className="border p-1 rounded w-full bg-gray-100"
                                />
                            </div>
                            <div className="pt-2 flex justify-between space-x-2">
                                <button
                                    onClick={() => handleSave(index)}
                                    className="cursor-pointer active:scale-95 text-white hover:bg-neutral-700 bg-black/40 px-4 py-2 rounded-lg transition font-medium"
                                >
                                    Save
                                </button>
                                {isTableOpen && (
                                    <button
                                        onClick={handleClose}
                                        className="cursor-pointer active:scale-95 text-white hover:bg-neutral-700 bg-black/40 px-4 py-2 rounded-lg transition font-medium"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
