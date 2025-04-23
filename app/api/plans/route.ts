import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from "next/server";

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
        const plans = await prisma.visiting_plans.findMany({
            include: {
                landmarks: true,
            },
        });

        return new Response(JSON.stringify(plans), { status: 200 });
    } catch (error) {
        console.error('Error fetching visiting plans:', error);
        return new Response('Failed to fetch visiting plans', { status: 500 });
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
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const data = await req.json();
    const { user_name, landmark_id, planned_date, note } = data;

    const updatedPlan = await prisma.visiting_plans.update({
        where: { id: parseInt(params.id) },
        data: {
            user_name,
            landmark_id,
            planned_date: new Date(planned_date),
            note,
        },
    });

    return NextResponse.json(updatedPlan);
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
