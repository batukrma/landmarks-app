import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
    try {
        // 1. PlanItem verilerini sil
        await prisma.planItem.deleteMany();
        console.log('PlanItem verileri başarıyla silindi.');

        // 2. VisitingPlan verilerini sil
        await prisma.visitingPlan.deleteMany();
        console.log('VisitingPlan verileri başarıyla silindi.');

        // 3. Landmark verilerini sil
        await prisma.landmark.deleteMany();
        console.log('Landmark verileri başarıyla silindi.');
    } catch (error) {
        console.error('Veriler silinirken hata oluştu:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();
