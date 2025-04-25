import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const planId = parseInt(params.id);

    if (isNaN(planId)) {
        return NextResponse.json({ message: 'Invalid plan ID' }, { status: 400 });
    }

    try {
        await prisma.visitingPlan.delete({
            where: { id: planId },
        });

        return NextResponse.json({ message: 'Plan and related items deleted successfully' });
    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json({ message: 'Failed to delete plan' }, { status: 500 });
    }
}

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
