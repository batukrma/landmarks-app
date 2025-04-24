import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id);
    const body = await req.json();
    const { name, description } = body;

    if (!name && !description) {
        return NextResponse.json({ message: 'No data to update' }, { status: 400 });
    }

    try {
        const updatedLandmark = await prisma.landmark.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
            },
        });

        return NextResponse.json(updatedLandmark);
    } catch (error) {
        return NextResponse.json(
            { message: 'Update failed', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
