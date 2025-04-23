import { DateTime } from 'luxon';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { name, items }: { name: string; items: Prisma.PlanItemCreateManyInput[] } = await request.json();
        console.log('Plan oluşturuluyor:', name, items);

        let plan = await prisma.visitingPlan.findFirst({ where: { name } });
        if (!plan) {
            console.log('Yeni plan oluşturuluyor...');
            plan = await prisma.visitingPlan.create({ data: { name } });
        }

        const newPlanItems = await Promise.all(
            items.map(async (item: Prisma.PlanItemCreateManyInput) => {
                const parsedPlannedDate = DateTime.fromISO(item.plannedDate, { zone: 'utc' });

                if (!parsedPlannedDate.isValid) {
                    throw new Error(`Geçersiz tarih formatı: landmarkId ${item.landmarkId} - Tarih: ${item.plannedDate}`);
                }

                const createdItem = await prisma.planItem.create({
                    data: {
                        landmark: { connect: { id: item.landmarkId } },
                        plannedDate: parsedPlannedDate.toJSDate(),
                        visited: false,
                        visitingPlan: { connect: { id: plan!.id } },
                    },
                });

                return createdItem;
            })
        );

        console.log('Plan ve plan item’lar başarıyla oluşturuldu.');
        return new NextResponse(
            JSON.stringify({
                success: true,
                plan: plan,
                planItems: newPlanItems,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Plan oluşturulurken hata:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Plan oluşturulurken bir hata oluştu.' }),
            { status: 500 }
        );
    }
}

//GET
export async function GET() {
    try {
        const plans = await prisma.visitingPlan.findMany({
            include: {
                items: {
                    include: {
                        landmark: true,
                    },
                },
            },
        });

        return NextResponse.json(plans);
    } catch (error) {
        console.error('Planlar alınırken hata:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Planlar alınırken bir hata oluştu.' }),
            { status: 500 }
        );
    }
}