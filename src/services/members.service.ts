import { PrismaClient } from '@prisma/client';
import { CreateMemberBody, UpdateMemberBody } from '../zodSchemas/schemas';
import createHttpError from 'http-errors';
import { addDays, isBefore } from 'date-fns';

const prisma = new PrismaClient();

export async function getMembers() {
  return await prisma.member.findMany({
    include: {
      membership: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getMemberById(id: string) {
  return await prisma.member.findUnique({
    where: { id },
    include: {
      membership: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getMemberByUniqueId(uniqueId: string) {
  return await prisma.member.findUnique({
    where: { uniqueId },
    include: {
      membership: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function createMember(memberData: CreateMemberBody) {
  const membership = await prisma.membership.findUnique({
    where: {
      id: memberData.membershipId,
    },
  });

  if (!membership) throw createHttpError(404, "Membership doesn't exist.");

  const staffExists = await prisma.user.findUnique({
    where: {
      id: memberData.staffId,
    },
  });

  if (!staffExists) throw createHttpError(404, "Staff user doesn't exist.");

  const uniqueIdTaken = await prisma.member.findUnique({
    where: { uniqueId: memberData.uniqueId },
  });

  if (uniqueIdTaken)
    throw createHttpError(409, 'A member with this Unique ID already exists.');

  const startDate = memberData.startDate
    ? new Date(memberData.startDate)
    : new Date();
  const endDate = memberData.endDate
    ? new Date(memberData.endDate)
    : addDays(startDate, membership.durationDays);

  return await prisma.member.create({
    data: {
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      dateOfBirth: memberData.dateOfBirth,
      uniqueId: memberData.uniqueId,
      startDate: startDate,
      endDate: endDate,
      membershipId: memberData.membershipId,
      staffId: memberData.staffId,
    },
    include: {
      membership: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function updateMember(
  memberId: string,
  newMemberData: UpdateMemberBody
) {
  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) throw createHttpError(404, 'Member not found.');

  const uniqueIdTaken = await prisma.member.findFirst({
    where: {
      uniqueId: newMemberData.uniqueId,
      id: {
        not: memberId,
      },
    },
  });

  if (uniqueIdTaken)
    throw createHttpError(409, 'A member with this Unique ID already exists.');

  const emailTaken = await prisma.member.findFirst({
    where: {
      email: newMemberData.email,
      id: {
        not: memberId,
      },
    },
  });

  if (emailTaken)
    throw createHttpError(409, 'A member with this email already exists.');

  return prisma.member.update({
    where: {
      id: memberId,
    },
    data: {
      name: newMemberData.name,
      email: newMemberData.email,
      phone: newMemberData.phone,
      uniqueId: newMemberData.uniqueId,
      dateOfBirth: newMemberData.dateOfBirth,
    },
    include: {
      membership: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function extendMembership(memberId: string, membershipId: string) {
  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) throw createHttpError(404, 'Member not found.');

  const membership = await prisma.membership.findUnique({
    where: {
      id: membershipId,
    },
  });

  if (!membership) throw createHttpError(404, 'Membership not found');

  const currentDate = new Date();
  let startDate;

  if (isBefore(currentDate, new Date(member.endDate))) {
    // membership still valid → extend from existing endDate
    startDate = new Date(member.endDate);
  } else {
    // membership expired → start from today
    startDate = currentDate;
  }

  const endDate = addDays(startDate, membership.durationDays);

  return await prisma.member.update({
    where: {
      id: memberId,
    },
    data: {
      membershipId,
      startDate: startDate,
      endDate: endDate,
    },
    include: {
      membership: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function deleteMember(memberId: string) {
  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) throw createHttpError(404, 'Member not found.');

  try {
    await prisma.member.delete({
      where: {
        id: memberId,
      },
    });
  } catch (error) {
    console.error(error);
    throw createHttpError(500, 'Something went wrong while deleting member.');
  }
}
