import { useState, useEffect } from 'react'

interface PlanInput {
    id: number
    planName: string
    description: string
    planned_date: Date
    landmark_id?: number
}

interface Landmark {
    id: number
    name: string
    description: string
    category: string
    latitude: number
    longitude: number
}

interface PlansTableProps {
    show: boolean
    onClose: () => void
    landmarks: Landmark[]
}

export default function PlansTable({ show, onClose, landmarks }: PlansTableProps) {
    const [planInputs, setPlanInputs] = useState<PlanInput[]>([])
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)

    useEffect(() => {
        if (show) {
            setPlanInputs([{
                id: 1,
                planName: '',
                description: '',
                planned_date: new Date(), // Doğrudan new Date() kullanıyoruz
            }])
            setSelectedNoteId(null) // Her açıldığında sıfırla
        }
    }, [show])

    if (!show) return null

    async function handleAddPlan() {
        if (selectedNoteId === null) return

        const selectedNote = landmarks.find(n => n.id === selectedNoteId)
        if (!selectedNote) return

        const newPlan: PlanInput = {
            id: Date.now(),
            planName: selectedNote.name,
            description: selectedNote.description,
            planned_date: planInputs[0].planned_date,
            landmark_id: selectedNote.id,
        }

        try {
            const response = await fetch('/api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_name: "demo_user",
                    note: newPlan.description,
                    planned_date: newPlan.planned_date.toISOString(),
                    landmark_id: newPlan.landmark_id,
                }),
            })

            if (!response.ok) throw new Error('Failed to create plan')

            console.log('Plan added successfully')
        } catch (err) {
            console.error('Error adding plan:', err)
        }

        // Formu temizle
        setPlanInputs([{
            id: 1,
            planName: '',
            description: '',
            planned_date: new Date(),
        }])
        setSelectedNoteId(null)
    }

    function handleChange(index: number, field: keyof PlanInput, value: string | Date) {
        const updatedInputs = [...planInputs]
        updatedInputs[index] = {
            ...updatedInputs[index],
            [field]: value,
        }
        setPlanInputs(updatedInputs)
    }

    function handleDateChange(index: number, value: string) {
        const updatedInputs = [...planInputs]
        updatedInputs[index] = {
            ...updatedInputs[index],
            planned_date: new Date(value),
        }
        setPlanInputs(updatedInputs)
    }

    return (
        <div className="fixed top-1/2 left-0 transform -translate-y-1/2 p-4 w-96 max-h-screen overflow-y-auto shadow-lg z-50 bg-white rounded-lg">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 font-bold text-xl">×</button>

            {planInputs.map((plan, index) => (
                <div key={plan.id} className="text-gray-900 border p-4 rounded-md shadow space-y-2 bg-gray-50 mb-4">
                    <div>
                        <label className="block text-sm font-medium">Plan Name</label>
                        <input
                            type="text"
                            value={plan.planName}
                            onChange={(e) => handleChange(index, 'planName', e.target.value)}
                            className="border p-1 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Plan Date</label>
                        <input
                            type="date"
                            value={plan.planned_date.toISOString().split('T')[0]}
                            onChange={(e) => handleDateChange(index, e.target.value)}
                            className="border p-1 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Select Landmark</label>
                        <select
                            value={selectedNoteId ?? ''}
                            onChange={(e) => setSelectedNoteId(Number(e.target.value))}
                            className="border p-1 rounded w-full"
                        >
                            <option value="">-- Select a landmark --</option>
                            {landmarks.map(note => (
                                <option key={note.id} value={note.id}>{note.name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedNoteId && (() => {
                        const selectedNote = landmarks.find(n => n.id === selectedNoteId)
                        if (!selectedNote) return null
                        return (
                            <div className="p-2 border rounded bg-white shadow-sm text-sm">
                                <p><strong>Name:</strong> {selectedNote.name}</p>
                                <p><strong>Description:</strong> {selectedNote.description}</p>
                                <p><strong>Category:</strong> {selectedNote.category}</p>
                                <p><strong>Latitude:</strong> {selectedNote.latitude}</p>
                                <p><strong>Longitude:</strong> {selectedNote.longitude}</p>
                            </div>
                        )
                    })()}

                    <button
                        onClick={handleAddPlan}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                        Add Plan
                    </button>
                </div>
            ))}
        </div>
    )
}
