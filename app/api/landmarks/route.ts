import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// CREATE: Yeni landmark oluştur
export async function POST(request: Request) {
    try {
        const { name, latitude, longitude, description, category } = await request.json()
        const newLandmark = await prisma.landmarks.create({
            data: { name, latitude, longitude, description, category }
        })
        return new Response(JSON.stringify(newLandmark), { status: 201 })
    } catch {
        return new Response('Failed to create landmark', { status: 500 })
    }
}

// READ: Tüm landmarkları getir
export async function GET() {
    try {
        const landmarks = await prisma.landmarks.findMany()
        return new Response(JSON.stringify(landmarks), { status: 200 })
    } catch {
        return new Response('Failed to fetch landmarks', { status: 500 })
    }
}

// READ: Tek bir landmark getir
export async function GET_ONE(request: Request) {
    try {
        const id = parseInt(request.url.split('/').pop() || '')
        const landmark = await prisma.landmarks.findUnique({ where: { id } })
        if (!landmark) {
            return new Response('Landmark not found', { status: 404 })
        }
        return new Response(JSON.stringify(landmark), { status: 200 })
    } catch {
        return new Response('Failed to fetch landmark', { status: 500 })
    }
}

// UPDATE: Varolan bir landmark'ı güncelle
export async function PUT(request: Request) {
    try {
        const { id, name, latitude, longitude, description, category } = await request.json()
        const updatedLandmark = await prisma.landmarks.update({
            where: { id },
            data: { name, latitude, longitude, description, category }
        })
        return new Response(JSON.stringify(updatedLandmark), { status: 200 })
    } catch {
        return new Response('Failed to update landmark', { status: 500 })
    }
}

// DELETE: Landmark'ı sil
export async function DELETE(request: Request) {
    try {
        const id = parseInt(request.url.split('/').pop() || '')
        const deletedLandmark = await prisma.landmarks.delete({ where: { id } })
        return new Response(JSON.stringify(deletedLandmark), { status: 200 })
    } catch {
        return new Response('Failed to delete landmark', { status: 500 })
    }
}
