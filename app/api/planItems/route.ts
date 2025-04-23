import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

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
