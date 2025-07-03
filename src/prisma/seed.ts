import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { addDays, subDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  const today = new Date();

  // Create hashed passwords
  const adminPassword = await bcrypt.hash('password', 10);
  const staffPassword = await bcrypt.hash('password', 10);

  // Create admin user
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

  // Create staff user
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
  await prisma.membership.createMany({
    data: [
      { name: 'Daily', durationDays: 1, price: 5 },
      { name: 'Monthly', durationDays: 30, price: 30 },
      { name: 'Half Year', durationDays: 180, price: 150 },
      { name: 'Yearly', durationDays: 365, price: 250 },
    ],
  });

  // Fetch all memberships
  const allMemberships = await prisma.membership.findMany();

  // Create 50 members with mixed active/expired status
  const memberCount = 50;

  const memberData = Array.from({ length: memberCount }, (_, i) => {
    const membership = allMemberships[i % allMemberships.length];

    // Random start date up to 365 days ago
    const daysAgo = Math.floor(Math.random() * 365);
    const startDate = subDays(today, daysAgo);
    const endDate = addDays(startDate, membership.durationDays);

    return {
      name: `Member ${i + 1}`,
      email: `member${i + 1}@example.com`,
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      uniqueId: `CARD${i + 1}`,
      startDate,
      endDate,
      membershipId: membership.id,
      staffId: staff.id,
    };
  });

  await prisma.member.createMany({ data: memberData });

  // Debug summary
  const expiredCount = memberData.filter((m) => m.endDate < today).length;
  console.log(
    `✅ Seeded ${memberCount} members (${expiredCount} expired, ${
      memberCount - expiredCount
    } active).`
  );
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
