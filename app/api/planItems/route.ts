import { PrismaClient } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const visited = searchParams.get('visited') === 'true'

    try {
        const planItems = await prisma.planItem.findMany({
            where: { visited },
            include: { landmark: true }
        })
        return NextResponse.json(planItems)
    } catch (error) {
        console.error('Error fetching plan items:', error)
        return NextResponse.json({ error: 'Failed to fetch plan items' }, { status: 500 })
    }
}

// DELETE: Plan item'ı (landmark'ı) silme
export async function DELETE(request: NextRequest) {
    try {
        const { planItemId } = await request.json(); // Plan item ID'si

        const deletedItem = await prisma.planItem.delete({
            where: { id: planItemId },
        });

        return new NextResponse(
            JSON.stringify({ success: true, deletedItem }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Plan item silinirken hata:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Plan item silinirken bir hata oluştu.' }),
            { status: 500 }
        );
    }
}

