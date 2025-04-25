import { LANDMARK_CATEGORIES } from '@/utils/constants';
import { useEffect, useState } from 'react';

type Landmark = {
    id: number;
    name: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
};

export default function LandmarkTable({ selectedLandmark }: { selectedLandmark: [number, number] }) {
    const [landmarks, setLandmarks] = useState<Landmark[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(13);
    const [isTableOpen, setIsTableOpen] = useState(false);
    const [id, setid] = useState<number | null>(null);
    const [showLandmarkList, setShowLandmarkList] = useState(false);


    useEffect(() => {
        fetchLandmarks();
    }, []);

    useEffect(() => {
        if (isTableOpen) {
            setLatitude(selectedLandmark[0]);
            setLongitude(selectedLandmark[1]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLandmark]);

    const fetchLandmarks = async () => {
        try {
            const res = await fetch('/api/landmarks');
            if (!res.ok) {
                throw new Error('Landmark verileri alınamadı');
            }
            const data: Landmark[] = await res.json();
            console.log(data); // Yanıtı buraya loglayın

            setLandmarks(data);
        } catch (error) {
            console.error("Landmark verileri alınamadı:", error);
        }
    };

    const handleAddLandmark = () => {
        if (selectedLandmark[0] === 0 || selectedLandmark[1] === 0) {
            alert("Lütfen not eklenecek bir konum seçiniz.");
            return;
        }
        setid(null);
        setName('');
        setDescription('');
        setCategory('');
        setLatitude(selectedLandmark[0]);
        setLongitude(selectedLandmark[1]);
        setIsTableOpen(true);
    };

    const handleSelectLandmark = (landmark: Landmark) => {
        setid(landmark.id);
        setName(landmark.name);
        setDescription(landmark.description);
        setCategory(landmark.category);
        setLatitude(Number(landmark.latitude));
        setLongitude(Number(landmark.longitude));
        setShowLandmarkList(false); // Landmark seçildiğinde listeyi gizle
        setIsTableOpen(true);
    };

    const handleSave = async () => {
        if (!name || !description || !category) {
            alert("Lütfen tüm alanları doldurun!");
            return;
        }

        const confirmed = confirm("Bu işlemi onaylıyor musunuz?");
        if (!confirmed) return;

        const payload = { name, description, category, latitude, longitude };
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/landmarks/${id}` : '/api/landmarks';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                await fetchLandmarks();
                handleClose();
            } else {
                console.error('Landmark kaydedilemedi.');
            }
        } catch (error) {
            console.error("Hata:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/landmarks/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {

                throw new Error('Silme başarısız');
            }
            await fetchLandmarks();
            handleClose();
        } catch (error) {
            console.error('Delete failed', error);
            alert('Silme başarısız.');
        }
    };


    const handleClose = () => {
        setIsTableOpen(false);
        setid(null);
    };

    return (
        <div className="fixed top-1/2 right-0 transform -translate-y-1/2 p-4 w-96 max-h-screen overflow-y-auto shadow-lg z-50">
            <div className="flex flex-col space-y-4">
                {!isTableOpen && (
                    <>
                        <button
                            onClick={handleAddLandmark}
                            className="cursor-pointer active:scale-95 text-neutral-1000 hover:bg-black bg-neutral-700 px-4 py-2 rounded-lg transition font-medium"
                        >
                            Add Note
                        </button>

                        <button
                            onClick={() => setShowLandmarkList((prev) => !prev)}
                            className="cursor-pointer active:scale-95 text-neutral-1000 hover:bg-black bg-neutral-400 px-4 py-2 rounded-lg transition font-medium mt-2"
                        >
                            {showLandmarkList ? "Landmarkları Gizle" : "Landmarkları Göster"}
                        </button>
                    </>
                )}
                {showLandmarkList && (
                    <div className="space-y-1 max-h-64 overflow-y-auto border rounded p-2 bg-white shadow-inner">
                        {landmarks.map((landmark) => (
                            <div
                                key={landmark.id}
                                onClick={() => handleSelectLandmark(landmark)}
                                className="cursor-pointer px-2 py-1 rounded hover:bg-neutral-200 transition text-sm text-black border border-neutral-200"
                            >
                                {landmark.name}
                            </div>
                        ))}
                    </div>
                )}


                {isTableOpen && (
                    <div className="text-gray-900 border p-4 rounded-md shadow space-y-2 bg-gray-50">
                        <div>
                            <label className="block text font-medium">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-1 rounded w-full"
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
                                <option value="">Seçiniz</option>
                                {LANDMARK_CATEGORIES.map((c, index) => (
                                    <option key={index} value={c}>
                                        {c}
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
                                {id ? "Update" : "Save"}
                            </button>
                            {id && (
                                <button
                                    onClick={() => handleDelete(id)}
                                    className="cursor-pointer active:scale-95 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition font-medium"
                                >
                                    Delete
                                </button>
                            )}
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