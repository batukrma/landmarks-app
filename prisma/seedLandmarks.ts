import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const landmarks = [
        {
            name: 'Eiffel Tower',
            latitude: 48.8584,
            longitude: 2.2945,
            description: 'A wrought-iron lattice tower on the Champ de Mars in Paris, France.',
            category: 'Historical Landmark',
        },
        {
            name: 'Great Wall of China',
            latitude: 40.4319,
            longitude: 116.5704,
            description: 'A series of fortifications that stretch across northern China.',
            category: 'Historical Landmark',
        },
        {
            name: 'Machu Picchu',
            latitude: -13.1631,
            longitude: -72.5450,
            description: 'An ancient Inca city located in the Andes Mountains of Peru.',
            category: 'Historical Landmark',
        },
        {
            name: 'Colosseum',
            latitude: 41.8902,
            longitude: 12.4922,
            description: 'An ancient amphitheater located in the center of Rome, Italy.',
            category: 'Historical Landmark',
        },
        {
            name: 'Taj Mahal',
            latitude: 27.1751,
            longitude: 78.0421,
            description: 'An ivory-white marble mausoleum located in Agra, India.',
            category: 'Cultural Landmark',
        },
        {
            name: 'Statue of Liberty',
            latitude: 40.6892,
            longitude: -74.0445,
            description: 'A colossal statue on Liberty Island in New York Harbor, USA.',
            category: 'Historical Landmark',
        },
        {
            name: 'Christ the Redeemer',
            latitude: -22.9519,
            longitude: -43.2105,
            description: 'An iconic statue of Jesus Christ located in Rio de Janeiro, Brazil.',
            category: 'Religious Landmark',
        },
        {
            name: 'Pyramids of Giza',
            latitude: 29.9792,
            longitude: 31.1342,
            description: 'A group of ancient pyramids located near Cairo, Egypt.',
            category: 'Historical Landmark',
        },
        {
            name: 'Sydney Opera House',
            latitude: -33.8568,
            longitude: 151.2153,
            description: 'A multi-venue performing arts center located in Sydney, Australia.',
            category: 'Cultural Landmark',
        },
        {
            name: 'Angkor Wat',
            latitude: 13.4125,
            longitude: 103.8667,
            description: 'A temple complex in Cambodia, originally built as a Hindu temple.',
            category: 'Historical Landmark',
        },
    ];

    for (const landmark of landmarks) {
        await prisma.landmark.create({
            data: landmark,
        });
        console.log(`Landmark ${landmark.name} added successfully.`);
    }
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
