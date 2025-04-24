import { useState, useEffect } from 'react';

export interface Landmark {
    id: number;
    name?: string;
    latitude: string;
    longitude: string;
    description?: string;
    category?: string;
    planItems: PlanItem[];

}

interface PlanItem {
    id: string;
    description: string;
    visited: boolean;
    color: string;
    visited_date: string | null;
    visitor_name: string | null;
}

export interface VisitingPlan {
    id: number;
    name: string;
    items: PlanItem[];
}


export interface LandmarkFormProps {
    landmark: Landmark;
    onUpdate: (landmark: Landmark) => void;
    onCancel: () => void;
    onDelete: (landmarkId: number) => void;
    onRemoveLandmark: (landmarkId: number) => void;
    onClose: () => void;
    landmarks: Landmark[];
}

export default function UpdateForm({
    landmark,
    onUpdate,
    onCancel,
    onDelete,
    onRemoveLandmark,
}: LandmarkFormProps) {
    const [name, setName] = useState(landmark.name || '');
    const [latitude, setLatitude] = useState(landmark.latitude);
    const [longitude, setLongitude] = useState(landmark.longitude);
    const [description, setDescription] = useState(landmark.description || '');
    const [category, setCategory] = useState(landmark.category || '');

    useEffect(() => {
        if (!landmark) return;

        setName(landmark.name || '');
        setLatitude(landmark.latitude);
        setLongitude(landmark.longitude);
        setDescription(landmark.description || '');
        setCategory(landmark.category || '');
    }, [landmark]);

    const handleUpdate = async () => {
        const updatedLandmark = {
            ...landmark,
            name,
            latitude,
            longitude,
            description,
            category,
        };

        try {
            const response = await fetch('/api/landmark/route.ts', {
                method: 'PUT',
                body: JSON.stringify(updatedLandmark),
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = await response.json();
            if (!response.ok) {
                const errorMessage = responseData.error || 'Yer güncellenemedi';
                throw new Error(errorMessage);
            }

            onUpdate(updatedLandmark);
            alert('Yer başarıyla güncellendi!');
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(`Yer güncellenirken bir hata oluştu: ${err.message}`);
            } else {
                alert('Yer güncellenirken bir hata oluştu.');
            }
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch('/api/landmark/route.ts', {
                method: 'DELETE',
                body: JSON.stringify({ id: landmark.id }),
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = await response.json();
            if (!response.ok) {
                const errorMessage = responseData.error || 'Yer silinemedi';
                throw new Error(errorMessage);
            }

            onDelete(landmark.id);
            alert('Yer başarıyla silindi!');
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(`Yer silinirken bir hata oluştu: ${err.message}`);
            } else {
                alert('Yer silinirken bir hata oluştu.');
            }
        }
    };


    return (
        <div className="fixed top-1/2 left-0 transform -translate-y-1/2 p-4 w-96 max-h-screen overflow-y-auto shadow-lg z-50 bg-black/60 backdrop-blur-md rounded-xl">
            <button onClick={onCancel} className="absolute top-2 right-2 text-white font-bold text-xl">×</button>

            <div className="text-white border p-4 rounded-md shadow space-y-4 bg-black/40">
                <div>
                    <label className="block mb-1 font-medium">Yer Adı</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Örn: İstanbul"
                        className="bg-black/40 text-white w-full px-3 py-2 rounded-md border"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Enlem</label>
                    <input
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="Örn: 41.0082"
                        className="bg-black/40 text-white w-full px-3 py-2 rounded-md border"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Boylam</label>
                    <input
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="Örn: 28.9784"
                        className="bg-black/40 text-white w-full px-3 py-2 rounded-md border"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Açıklama</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Yer hakkında açıklama"
                        className="bg-black/40 text-white w-full px-3 py-2 rounded-md border"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Kategori</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Örn: Doğa, Tarihi"
                        className="bg-black/40 text-white w-full px-3 py-2 rounded-md border"
                    />
                </div>

                <div className="flex justify-between gap-4 mt-4">
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-700 active:scale-95 transition font-medium"
                    >
                        Güncelle
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-700 active:scale-95 transition font-medium"
                    >
                        Sil
                    </button>
                    <button
                        onClick={() => onRemoveLandmark(landmark.id)}
                        className="text-red-500 font-bold"
                    >
                        Sil
                    </button>
                </div>
            </div>
        </div>
    );
}
