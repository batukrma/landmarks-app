// testprisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const newLandmark = await prisma.visited_landmarks.create({
        data: {
            landmark_id: 2, // ID'si 2 olan landmark
            visitor_name: 'Kırma',
            visited_date: new Date('2025-04-22'), // Tarih doğru formatta
        },
    })

    console.log('Yeni ziyaret edilen yer eklendi:', newLandmark)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
