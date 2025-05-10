import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create hashed passwords
  const adminPassword = await bcrypt.hash('password', 10);
  const staffPassword = await bcrypt.hash('password', 10);

  // Create admin
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create staff
  const staff = await prisma.user.create({
    data: {
      name: 'Staff User',
      username: 'staff',
      email: 'staff@example.com',
      password: staffPassword,
      role: 'STAFF',
    },
  });

  // Create memberships
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const memberships = await prisma.membership.createMany({
    data: [
      { name: 'Daily', durationDays: 1, price: 5 },
      { name: 'Monthly', durationDays: 30, price: 30 },
      { name: 'Half Year', durationDays: 180, price: 150 },
      { name: 'Yearly', durationDays: 365, price: 250 },
    ],
  });

  // Get created memberships
  const allMemberships = await prisma.membership.findMany();

  // Create some members
  const memberPromises = allMemberships.map((membership, i) =>
    prisma.member.create({
      data: {
        name: `Member ${i + 1}`,
        email: `member${i + 1}@example.com`,
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        uniqueId: `CARD${i + 1}`,
        startDate: new Date(),
        endDate: new Date(
          Date.now() + membership.durationDays * 24 * 60 * 60 * 1000
        ),
        membershipId: membership.id,
        staffId: staff.id,
      },
    })
  );

  await Promise.all(memberPromises);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
