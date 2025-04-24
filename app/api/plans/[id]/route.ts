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
