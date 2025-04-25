import { useState, useEffect } from 'react';

interface PlanInput {
    landmarkId: number;
    planned_date: string;
}

interface Landmark {
    id: number;
    name: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
}

interface PlansTableProps {
    show: boolean;
    onClose: () => void;
    landmarks: Landmark[];
}

export default function PlansTable({ show, onClose, landmarks }: PlansTableProps) {
    const [planInputs, setPlanInputs] = useState<PlanInput[]>([]);
    const [selectedLandmarks, setSelectedLandmarks] = useState<Landmark[]>([]);
    const [planName, setPlanName] = useState('');

    useEffect(() => {
        if (show) {
            setPlanInputs([]);
            setSelectedLandmarks([]);
            setPlanName('');
        }
    }, [show]);

    if (!show) return null;

    async function handleAddPlans() {
        if (!planName.trim()) {
            alert("Plan ismini girmelisiniz.");
            return;
        }

        if (selectedLandmarks.length === 0) {
            alert("En az bir yer seçmelisiniz.");
            return;
        }

        const invalidPlans = planInputs.some(input => new Date(input.planned_date) < new Date());
        if (invalidPlans) {
            alert("Planlanan tarih geçmişte olamaz.");
            return;
        }

        const newPlanItems = selectedLandmarks.map(landmark => {
            const planInput = planInputs.find(input => input.landmarkId === landmark.id);
            return {
                landmarkId: landmark.id,
                plannedDate: planInput ? planInput.planned_date : new Date().toISOString(),
            };
        });

        const visitingPlan = {
            name: planName,
            items: newPlanItems,
        };

        try {
            const response = await fetch('/api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visitingPlan),
            });

            const responseData = await response.json();

            if (!response.ok) {
                const errorMessage = responseData.error || 'Plan oluşturulamadı';
                throw new Error(errorMessage);
            }

            alert('Gezinti planı başarıyla oluşturuldu!');
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(`Plan eklerken bir hata oluştu: ${err.message}`);
            } else {
                alert('Plan eklerken bir hata oluştu.');
            }
        }

        setPlanInputs([]);
        setSelectedLandmarks([]);
        setPlanName('');
    }

    function handleSelectLandmark(event: React.ChangeEvent<HTMLSelectElement>) {
        const landmarkId = parseInt(event.target.value);
        const selectedLandmark = landmarks.find((landmark) => landmark.id === landmarkId);

        if (selectedLandmark && !selectedLandmarks.some(landmark => landmark.id === selectedLandmark.id)) {
            setSelectedLandmarks([...selectedLandmarks, selectedLandmark]);
            setPlanInputs([
                ...planInputs,
                { landmarkId: selectedLandmark.id, planned_date: new Date().toISOString() },
            ]);
        }
    }

    function handleRemoveLandmark(landmarkId: number) {
        setSelectedLandmarks(selectedLandmarks.filter(landmark => landmark.id !== landmarkId));
        setPlanInputs(planInputs.filter(input => input.landmarkId !== landmarkId));
    }

    function handleDateChange(landmarkId: number, value: string) {
        setPlanInputs(prevInputs => {
            const updated = prevInputs.map(input =>
                input.landmarkId === landmarkId
                    ? { ...input, planned_date: value }
                    : input
            );
            return updated;
        });
    }

    return (
        <div className="absolute bottom-0 right-142  transform -translate-y-1/2 p-4 w-96 max-h-screen overflow-y-auto shadow-lg z-50 bg-black/60 backdrop-blur-md rounded-xl">
            <button onClick={onClose} className="absolute top-2 right-2 text-white font-bold text-xl">×</button>

            <div className="text-white border p-4 rounded-md shadow space-y-4 bg-black/40">

                <div>
                    <label className="block mb-1 font-medium">Plan Adı</label>
                    <input
                        type="text"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        placeholder="Örn: Hafta Sonu Gezisi"
                        className="bg-black/40 text-white w-full px-3 py-2 rounded-md border"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold">Yer Seçimi</h3>
                    <select
                        defaultValue="default"
                        onChange={handleSelectLandmark}
                        className="bg-black/40 text-white py-2 px-4 rounded-lg border focus:outline-none w-full"
                    >
                        <option value="default" disabled>Bir yer seçin</option>
                        {landmarks
                            .filter(lm => !selectedLandmarks.some(sl => sl.id === lm.id))
                            .map((landmark) => (
                                <option key={landmark.id} value={landmark.id}>
                                    {landmark.name}
                                </option>
                            ))}

                    </select>
                </div>

                {selectedLandmarks.length > 0 && (
                    <div className="space-y-4 mt-2">
                        <h3 className="text-lg font-semibold">Seçilen Yerler</h3>
                        {selectedLandmarks.map(landmark => (
                            <div key={landmark.id} className="flex items-center justify-between border p-2 rounded-md bg-black/50">
                                <span className="font-semibold">{landmark.name}</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={planInputs.find(input => input.landmarkId === landmark.id)?.planned_date.split('T')[0] || ''}
                                        onChange={(e) => handleDateChange(landmark.id, e.target.value)}
                                        className="border py-1 px-2 rounded bg-black/30 text-white"
                                    />
                                    <button
                                        onClick={() => handleRemoveLandmark(landmark.id)}
                                        className="text-red-500 font-bold"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={handleAddPlans}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-700 active:scale-95 transition font-medium"
                >
                    Planı Ekle
                </button>
            </div>
        </div>
    );
}
