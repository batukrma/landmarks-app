import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { plan_id } = body

        const updatedItem = await prisma.planItem.update({
            where: { id: plan_id },
            data: {
                visited: true,
            },
        })

        return NextResponse.json(updatedItem)
    } catch (error) {
        console.error('Error marking visit:', error)
        return NextResponse.json({ error: 'Failed to mark visit' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { planItemId } = body;

        const updatedItem = await prisma.planItem.update({
            where: { id: planItemId },
            data: {
                visited: true, // Ziyaret edilme durumunu true yapıyoruz
            },
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error('Hata meydana geldi:', error);
        return NextResponse.json({ error: 'Ziyaret durumu güncellenirken hata oluştu.' }, { status: 500 });
    }
}


