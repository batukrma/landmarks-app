import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    const { name, description, category, latitude, longitude } = await req.json();

    const data: { name?: string; description?: string; category?: string; latitude?: number; longitude?: number } = {};

    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (latitude !== undefined) data.latitude = parseFloat(latitude);
    if (longitude !== undefined) data.longitude = parseFloat(longitude);

    try {
        const updatedLandmark = await prisma.landmark.update({
            where: { id: Number(id) },
            data,
        });

        return NextResponse.json(updatedLandmark); // Success response
    } catch (error) {
        console.error("Güncelleme hatası:", error);
        return new NextResponse(
            JSON.stringify({
                message: 'Update failed',
                error: error instanceof Error ? error.message : String(error),
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}



export async function DELETE(req: Request, { params }: { params: { id: number } }) {
    const { id } = params; // This uses the dynamic parameter 'id'

    try {
        await prisma.landmark.delete({
            where: { id: Number(id) },
        });

        return new NextResponse(null, { status: 204 }); // No content status code
    } catch (error) {
        console.error("Silme hatası:", error);
        return new NextResponse(
            JSON.stringify({
                message: 'Delete failed',
                error: error instanceof Error ? error.message : String(error),
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
