import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const prisma = new PrismaClient();

async function seed() {
  try {
    const users = [
      {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'mypassword',
      },
      {
        email: 'emily.roberts@example.com',
        firstName: 'Emily',
        lastName: 'Roberts',
        password: 'delulu',
      },
      {
        email: 'olivia.johnson@example.com',
        firstName: 'Olivia',
        lastName: 'Johnson',
        password: 'qwerty',
      },
    ];

    const usersWithHashedPasswords: Prisma.UserCreateManyInput[] =
      await Promise.all(
        users.map(async ({ email, firstName, lastName, password }) => {
          const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
          return { email, firstName, lastName, passwordHash };
        }),
      );

    await prisma.user.createMany({
      data: usersWithHashedPasswords,
      skipDuplicates: true,
    });

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
