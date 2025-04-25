import { LANDMARK_CATEGORIES } from '@/utils/constants';
import { useEffect, useState } from 'react';

export default function LandmarkTable({ selectedLandmark }: { selectedLandmark: [number, number] }) {
    // Her input için ayrı state'ler
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [latitude, setLatitude] = useState<number | string>(selectedLandmark[0]);
    const [longitude, setLongitude] = useState<number | string>(selectedLandmark[1]);

    const [isTableOpen, setIsTableOpen] = useState(false);

    const handleAddLandmark = () => {
        if (selectedLandmark[0] === 0 || selectedLandmark[1] === 0) {
            alert("Lütfen not eklenecek bir konum seçiniz.")
            return;
        }
        setName('');
        setDescription('');
        setCategory('');
        setLatitude(selectedLandmark[0]);
        setLongitude(selectedLandmark[1]);
        setIsTableOpen(true);
    };

    useEffect(() => {
        if (isTableOpen) {
            setLatitude(selectedLandmark[0]);
            setLongitude(selectedLandmark[1]);
        }
    }, [selectedLandmark, isTableOpen]);

    const handleSave = async () => {
        if (!name || !description || !category) {
            alert("Lütfen tüm alanları doldurun!");
            return;
        }
        const confirmed = confirm("Are you sure you want to save this landmark?");
        if (!confirmed) return;

        try {
            const response = await fetch('/api/landmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, category, latitude, longitude }),
            });

            if (response.ok) {
                console.log('Saved Landmark:', await response.json());
                setIsTableOpen(false);
            } else {
                console.error('Failed to save landmark');
            }
        } catch (error) {
            console.error('Error saving landmark:', error);
        }
    };

    const handleClose = () => {
        setIsTableOpen(false);
    };

    return (
        <div className="fixed top-1/2 right-0 transform -translate-y-1/2 p-4 w-96 max-h-screen overflow-y-auto shadow-lg z-50">
            <div className="flex flex-col space-y-4">
                {!isTableOpen && (
                    <button
                        onClick={handleAddLandmark}
                        className="cursor-pointer active:scale-95 text-neutral-1000 hover:bg-black bg-neutral-700 px-4 py-2 rounded-lg transition font-medium"
                    >
                        Add Note
                    </button>
                )}
                {isTableOpen && (
                    <div className="text-gray-900 border p-4 rounded-md shadow space-y-2 bg-gray-50">
                        <div>
                            <label className="block text font-medium">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-1 rounded w-full "
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border p-1 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border p-1 rounded w-full"
                            >
                                {LANDMARK_CATEGORIES.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Latitude</label>
                            <input
                                type="text"
                                value={latitude}
                                readOnly
                                className="border p-1 rounded w-full bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Longitude</label>
                            <input
                                type="text"
                                value={longitude}
                                readOnly
                                className="border p-1 rounded w-full bg-gray-100"
                            />
                        </div>
                        <div className="pt-2 flex justify-between space-x-2">
                            <button
                                onClick={handleSave}
                                className="cursor-pointer active:scale-95 text-white hover:bg-neutral-700 bg-black/40 px-4 py-2 rounded-lg transition font-medium"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleClose}
                                className="cursor-pointer active:scale-95 text-white hover:bg-neutral-700 bg-black/40 px-4 py-2 rounded-lg transition font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
