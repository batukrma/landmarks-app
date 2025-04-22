import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// CREATE: Yeni ziyaret kaydı oluştur
export async function POST(request: Request) {
    try {
        const { landmark_id, visited_date, visitor_name } = await request.json()
        const newVisitedLandmark = await prisma.visited_landmarks.create({
            data: {
                landmark_id,
                visited_date,
                visitor_name
            }
        })
        return new Response(JSON.stringify(newVisitedLandmark), { status: 201 })
    } catch {
        return new Response('Failed to create visited landmark', { status: 500 })
    }
}

// READ: Tüm ziyaret edilmiş yerleri getir
export async function GET() {
    try {
        const visitedLandmarks = await prisma.visited_landmarks.findMany({
            include: {
                landmarks: true,  // landmarks tablosunu dahil et
            }
        })

        const visitedLandmarksWithLandmarks = visitedLandmarks.filter(vl => vl.landmarks);

        return new Response(JSON.stringify(visitedLandmarksWithLandmarks), { status: 200 })
    } catch {
        return new Response('Failed to fetch visited landmarks', { status: 500 })
    }
}

// READ: Tek bir ziyaret kaydını getir
export async function GET_ONE(request: Request) {
    try {
        const id = parseInt(request.url.split('/').pop() || '')
        const visitedLandmark = await prisma.visited_landmarks.findUnique({
            where: { id }
        })
        if (!visitedLandmark) {
            return new Response('Visited landmark not found', { status: 404 })
        }
        return new Response(JSON.stringify(visitedLandmark), { status: 200 })
    } catch {
        return new Response('Failed to fetch visited landmark', { status: 500 })
    }
}

// UPDATE: Var olan bir ziyaret kaydını güncelle
export async function PUT(request: Request) {
    try {
        const { id, landmark_id, visited_date, visitor_name } = await request.json()
        const updatedVisitedLandmark = await prisma.visited_landmarks.update({
            where: { id },
            data: { landmark_id, visited_date, visitor_name }
        })
        return new Response(JSON.stringify(updatedVisitedLandmark), { status: 200 })
    } catch {
        return new Response('Failed to update visited landmark', { status: 500 })
    }
}

// DELETE: Ziyaret kaydını sil
export async function DELETE(request: Request) {
    try {
        const id = parseInt(request.url.split('/').pop() || '')
        const deletedVisitedLandmark = await prisma.visited_landmarks.delete({
            where: { id }
        })
        return new Response(JSON.stringify(deletedVisitedLandmark), { status: 200 })
    } catch {
        return new Response('Failed to delete visited landmark', { status: 500 })
    }
}
