import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'


const prisma = new PrismaClient()

// CREATE: Yeni landmark oluştur
export async function POST(request: Request) {
    try {
        const { name, latitude, longitude, description, category } = await request.json()
        const newLandmark = await prisma.landmark.create({
            data: { name, latitude, longitude, description, category }
        })
        return new Response(JSON.stringify(newLandmark), { status: 201 })
    } catch {
        return new Response('Failed to create landmark', { status: 500 })
    }
}

export async function GET() {
    try {
        const landmarks = await prisma.landmark.findMany()
        return NextResponse.json(landmarks)
    } catch (error) {
        console.error('Error fetching landmarks:', error)
        return NextResponse.json({ error: 'Failed to fetch landmarks' }, { status: 500 })
    }
}

// UPDATE: Landmark'ı güncelleme
export async function PUT(request: Request) {
    try {
        const { id, name, latitude, longitude, description, category } = await request.json();
        const updatedLandmark = await prisma.landmark.update({
            where: { id },
            data: { name, latitude, longitude, description, category },
        });

        return new Response(JSON.stringify(updatedLandmark), { status: 200 });
    } catch (error) {
        console.error('Landmark güncellenirken hata:', error);
        return new Response('Landmark güncellenirken bir hata oluştu.', { status: 500 });
    }
}
