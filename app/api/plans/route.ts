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
const COLORS = [
    '#FFD700', // sarı
    '#00BFFF', // mavi
    '#32CD32', // yeşil
    '#FF69B4', // pembe
    '#FFA500', // turuncu
    '#8A2BE2', // mor
    '#DC143C', // kırmızı
    '#20B2AA', // turkuaz
    '#FF7F50', // mercan
    '#9370DB', // açık mor
];

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

        // Plan ID'ye göre renk atama
        const colorMap = new Map<number, string>();
        let colorIndex = 0;

        const coloredPlans = plans.map((plan) => {
            let color = colorMap.get(plan.id);
            if (!color) {
                color = COLORS[colorIndex % COLORS.length];
                colorMap.set(plan.id, color);
                colorIndex++;
            }

            return {
                ...plan,
                items: plan.items.map((item) => ({
                    ...item,
                    color,
                })),
            };
        });

        return NextResponse.json(coloredPlans);
    } catch (error) {
        console.error('Planlar alınırken hata:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Planlar alınırken bir hata oluştu.' }),
            { status: 500 }
        );
    }
}

// DELETE: Plan silme
export async function DELETE(request: NextRequest) {
    try {
        const { planId } = await request.json(); // Plan ID'yi alın

        // Planı ve planın itemlarını sil
        await prisma.planItem.deleteMany({ where: { visitingPlanId: planId } });
        const deletedPlan = await prisma.visitingPlan.delete({ where: { id: planId } });

        return new NextResponse(
            JSON.stringify({ success: true, deletedPlan }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Plan silinirken hata:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Plan silinirken bir hata oluştu.' }),
            { status: 500 }
        );
    }
}
