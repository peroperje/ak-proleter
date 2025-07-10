import { PrismaClient } from '@prisma/client';
//import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.result.deleteMany();
  await prisma.news.deleteMany();
  await prisma.event.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  // await prisma.category.deleteMany();

  console.log('Existing data cleared');

  // Create or update age categories
  const ageCategories = [
    { name: 'U8', description: 'Children under 8 years old', minAge: 0, maxAge: 7 },
    { name: 'U10', description: 'Children aged 8 to 10 years', minAge: 8, maxAge: 9 },
    { name: 'U12', description: 'Children aged 10 to 12 years', minAge: 10, maxAge: 11 },
    { name: 'U14', description: 'Young cadets (12–14 years)', minAge: 12, maxAge: 13 },
    { name: 'U16', description: 'Cadets (14–16 years)', minAge: 14, maxAge: 15 },
    { name: 'U18', description: 'Junior athletes (16–18 years)', minAge: 16, maxAge: 17 },
    { name: 'U20', description: 'Junior athletes (18–20 years)', minAge: 18, maxAge: 19 },
    { name: 'U23', description: 'Young seniors (20–23 years)', minAge: 20, maxAge: 22 },
    { name: 'SEN', description: 'Senior athletes (typically 20–34 years)', minAge: 20, maxAge: 34 },
    { name: 'V35', description: 'Masters athletes (35–39 years)', minAge: 35, maxAge: 39 },
    { name: 'V40', description: 'Masters athletes (40–44 years)', minAge: 40, maxAge: 44 },
    { name: 'V45', description: 'Masters athletes (45–49 years)', minAge: 45, maxAge: 49 },
    { name: 'V50', description: 'Masters athletes (50–54 years)', minAge: 50, maxAge: 54 },
    { name: 'V55', description: 'Masters athletes (55–59 years)', minAge: 55, maxAge: 59 },
    { name: 'V60', description: 'Masters athletes (60–64 years)', minAge: 60, maxAge: 64 },
    { name: 'V65', description: 'Masters athletes (65–69 years)', minAge: 65, maxAge: 69 },
    { name: 'V70', description: 'Masters athletes (70–74 years)', minAge: 70, maxAge: 74 },
    { name: 'V75', description: 'Masters athletes (75–79 years)', minAge: 75, maxAge: 79 },
    { name: 'V80', description: 'Masters athletes (80+ years)', minAge: 80, maxAge: null },
  ];

  for (const category of ageCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        minAge: category.minAge,
        maxAge: category.maxAge,
      },
      create: {
        name: category.name,
        description: category.description,
        minAge: category.minAge,
        maxAge: category.maxAge,
      },
    });
  }

  console.log('Age categories created or updated');

/*

  // Create categories
  const seniorCategory = await prisma.category.create({
    data: {
      name: 'Senior',
      description: 'Senior athletes category',
      minAge: 23,
    },
  });

  const u23Category = await prisma.category.create({
    data: {
      name: 'U23',
      description: 'Under 23 athletes category',
      minAge: 18,
    },
  });

  const sprintCategory = await prisma.category.create({
    data: {
      name: 'Sprint',
      description: 'Sprint disciplines',
      minAge: 0,
    },
  });

  const longDistanceCategory = await prisma.category.create({
    data: {
      name: 'Long Distance',
      description: 'Long distance disciplines',
      minAge: 0,
    },
  });

  const throwsCategory = await prisma.category.create({
    data: {
      name: 'Throws',
      description: 'Throwing disciplines',
      minAge: 0,
    },
  });

  console.log('Categories created');

  // Create users with hashed passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@akproleter.rs',
      name: 'Admin User',
      role: 'ADMIN',
      passwordHash,
    },
  });

  const coachUser = await prisma.user.create({
    data: {
      email: 'coach@akproleter.rs',
      name: 'Coach User',
      role: 'COACH',
      passwordHash,
    },
  });

  const markoUser = await prisma.user.create({
    data: {
      email: 'marko.petrovic@example.com',
      name: 'Marko Petrović',
      role: 'MEMBER',
      passwordHash,
      profile: {
        create: {
          dateOfBirth: new Date('1998-05-15'),
          phoneNumber: '+381 63 123 4567',
          category: {
            connect: {
              id: seniorCategory.id,
            },
          },
        },
      },
    },
  });

  const anaUser = await prisma.user.create({
    data: {
      email: 'ana.jovanovic@example.com',
      name: 'Ana Jovanović',
      role: 'MEMBER',
      passwordHash,
      profile: {
        create: {
          dateOfBirth: new Date('2000-08-22'),
          phoneNumber: '+381 64 987 6543',
          category: {
            connect: {
              id: u23Category.id,
            },
          },
        },
      },
    },
  });

  const nikolaUser = await prisma.user.create({
    data: {
      email: 'nikola.djordjevic@example.com',
      name: 'Nikola Đorđević',
      role: 'MEMBER',
      passwordHash,
      profile: {
        create: {
          dateOfBirth: new Date('1995-11-30'),
          phoneNumber: '+381 65 456 7890',
          category: {
            connect: {
              id: seniorCategory.id,
            },
          },
        },
      },
    },
  });

  const viewerUser = await prisma.user.create({
    data: {
      email: 'viewer@akproleter.rs',
      name: 'Viewer User',
      role: 'MEMBER',
      passwordHash,
    },
  });

  console.log('Users created');

  // Create events
  const competitionEvent = await prisma.event.create({
    data: {
      title: 'National Championship',
      description: 'Annual national athletics championship',
      location: 'Belgrade Stadium',
      startDate: new Date('2023-06-15'),
      endDate: new Date('2023-06-17'),
      type: 'COMPETITION',
      organizer: {
        connect: {
          id: adminUser.id,
        },
      },
      participants: {
        connect: [
          { id: markoUser.id },
          { id: anaUser.id },
          { id: nikolaUser.id },
        ],
      },
      categories: {
        connect: {
          id: seniorCategory.id,
        },
      },
    },
  });

  const trainingEvent = await prisma.event.create({
    data: {
      title: 'Sprint Training Camp',
      description: 'Intensive sprint training camp',
      location: 'Sports Center',
      startDate: new Date('2023-05-10'),
      endDate: new Date('2023-05-15'),
      type: 'TRAINING',
      organizer: {
        connect: {
          id: coachUser.id,
        },
      },
      participants: {
        connect: [{ id: anaUser.id }],
      },
      categories: {
        connect: {
          id: sprintCategory.id,
        },
      },
    },
  });

  console.log('Events created');

  // Create news items
  const newsItem1 = await prisma.news.create({
    data: {
      title: 'Club Anniversary Celebration',
      content: 'Join us for the 50th anniversary of our athletics club!',
      author: {
        connect: {
          id: adminUser.id,
        },
      },
      published: true,
    },
  });

  const newsItem2 = await prisma.news.create({
    data: {
      title: 'New Training Schedule',
      content: 'Check out our updated training schedule for the summer season.',
      author: {
        connect: {
          id: coachUser.id,
        },
      },
      published: true,
    },
  });

  console.log('News items created');

  // Create results
  const result1 = await prisma.result.create({
    data: {
      user: {
        connect: {
          id: markoUser.id,
        },
      },
      event: {
        connect: {
          id: competitionEvent.id,
        },
      },
      position: 2,
      score: '10:15.32',
      notes: 'Personal best',
    },
  });

  const result2 = await prisma.result.create({
    data: {
      user: {
        connect: {
          id: anaUser.id,
        },
      },
      event: {
        connect: {
          id: competitionEvent.id,
        },
      },
      position: 1,
      score: '11.92',
      notes: 'Season best',
    },
  });

  console.log('Results created');
*/

  console.log('Database seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
