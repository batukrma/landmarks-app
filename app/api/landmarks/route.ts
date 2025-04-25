import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const landmarks = await prisma.landmark.findMany();
        return NextResponse.json(landmarks);
    } catch (error) {
        console.error("Veri çekme hatası:", error);
        return NextResponse.json({ message: 'Error fetching landmarks', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { name, description, category, latitude, longitude } = await req.json();
    try {
        const newLandmark = await prisma.landmark.create({
            data: {
                name,
                description,
                category,
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
        });
        return NextResponse.json(newLandmark, { status: 201 });
    } catch (error) {
        console.error("Landmark kaydetme hatası:", error);
        return NextResponse.json({ message: 'Error saving landmark', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
