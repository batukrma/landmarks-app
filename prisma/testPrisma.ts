import prisma from './client'

async function testPrisma() {
    // Yeni bir landmark ekleyelim
    await prisma.visited_landmarks.create({
        data: {
            landmark_id: 1, // ilgili landmark_id'yi girin
            visited_date: new Date(),
            visitor_name: 'Ali'
        }
    })



    // Eklediğimiz landmark'ı veritabanından çekelim
    const landmarks = await prisma.landmarks.findMany();
    console.log('All landmarks:', landmarks)
}

testPrisma()
