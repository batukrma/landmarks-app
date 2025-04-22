import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// CREATE: Yeni plan oluştur
export async function POST(request: Request) {
    try {
        const { user_name, landmark_id, planned_date, note } = await request.json()
        const newPlan = await prisma.visiting_plans.create({
            data: {
                user_name,
                landmark_id,
                planned_date,
                note
            }
        })
        return new Response(JSON.stringify(newPlan), { status: 201 })
    } catch {
        return new Response('Failed to create visiting plan', { status: 500 })
    }
}

// READ: Tüm ziyaret planlarını getir
export async function GET() {
    try {
        const plans = await prisma.visiting_plans.findMany()
        return new Response(JSON.stringify(plans), { status: 200 })
    } catch {
        return new Response('Failed to fetch visiting plans', { status: 500 })
    }
}

// READ: Tek bir ziyaret planını getir
export async function GET_ONE(request: Request) {
    try {
        const id = parseInt(request.url.split('/').pop() || '')
        const plan = await prisma.visiting_plans.findUnique({
            where: { id }
        })
        if (!plan) {
            return new Response('Plan not found', { status: 404 })
        }
        return new Response(JSON.stringify(plan), { status: 200 })
    } catch {
        return new Response('Failed to fetch visiting plan', { status: 500 })
    }
}

// UPDATE: Varolan bir ziyaret planını güncelle
export async function PUT(request: Request) {
    try {
        const { id, user_name, landmark_id, planned_date, note } = await request.json()
        const updatedPlan = await prisma.visiting_plans.update({
            where: { id },
            data: { user_name, landmark_id, planned_date, note }
        })
        return new Response(JSON.stringify(updatedPlan), { status: 200 })
    } catch {
        return new Response('Failed to update visiting plan', { status: 500 })
    }
}

// DELETE: Ziyaret planını sil
export async function DELETE(request: Request) {
    try {
        const id = parseInt(request.url.split('/').pop() || '')
        const deletedPlan = await prisma.visiting_plans.delete({
            where: { id }
        })
        return new Response(JSON.stringify(deletedPlan), { status: 200 })
    } catch {
        return new Response('Failed to delete visiting plan', { status: 500 })
    }
}
