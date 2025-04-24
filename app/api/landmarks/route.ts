import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { name, latitude, longitude, description, category } = await request.json();
        const newLandmark = await prisma.landmark.create({
            data: { name, latitude, longitude, description, category }
        });
        return new Response(JSON.stringify(newLandmark), { status: 201 });
    } catch {
        return new Response('Failed to create landmark', { status: 500 });
    }
}

export async function GET() {
    try {
        const landmarks = await prisma.landmark.findMany();
        return NextResponse.json(landmarks);
    } catch (error) {
        console.error('Error fetching landmarks:', error);
        return NextResponse.json({ error: 'Failed to fetch landmarks' }, { status: 500 });
    }
}

type LandmarkData = {
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    category: string;
};

export async function updateLandmark(id: number, data: LandmarkData) {
    if (id === undefined || id === null) {
        throw new Error('Invalid ID');
    }

    try {
        const updatedLandmark = await prisma.landmark.update({
            where: { id: id },
            data: data,
        });
        return updatedLandmark;
    } catch (error) {
        console.error('Error updating landmark:', error);
        throw new Error('Failed to update landmark');
    }
}
