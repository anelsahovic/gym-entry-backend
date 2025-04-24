import { PrismaClient } from '@prisma/client';
import {
  CreateMembershipBody,
  UpdateMembershipBody,
} from '../zodSchemas/schemas';
import createHttpError from 'http-errors';

const prisma = new PrismaClient();

export async function getMemberships() {
  return prisma.membership.findMany();
}

export async function getMembershipById(membershipId: string) {
  return await prisma.membership.findUnique({
    where: {
      id: membershipId,
    },
  });
}

export async function createMembership(membershipData: CreateMembershipBody) {
  const membershipByName = await prisma.membership.findFirst({
    where: {
      name: membershipData.name,
    },
  });

  if (membershipByName)
    throw createHttpError(409, 'Membership with that name already exists.');

  return await prisma.membership.create({
    data: {
      name: membershipData.name,
      durationDays: membershipData.durationDays,
      price: membershipData.price,
    },
  });
}

export async function updateMembership(
  membershipId: string,
  newMembershipData: UpdateMembershipBody
) {
  const existingMembership = await prisma.membership.findUnique({
    where: {
      id: membershipId,
    },
  });

  if (!existingMembership)
    throw createHttpError(404, "Membership doesn't exist.");

  const membershipWithSameName = await prisma.membership.findFirst({
    where: {
      name: newMembershipData.name,
      id: {
        not: membershipId,
      },
    },
  });

  if (membershipWithSameName)
    throw createHttpError(409, 'Membership with that name already exists.');

  return await prisma.membership.update({
    where: {
      id: membershipId,
    },
    data: {
      name: newMembershipData.name,
      durationDays: newMembershipData.durationDays,
      price: newMembershipData.price,
    },
  });
}

export async function deleteMembership(membershipId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      id: membershipId,
    },
  });

  if (!membership) throw createHttpError(404, 'Membership not found.');

  try {
    await prisma.membership.delete({
      where: {
        id: membershipId,
      },
    });
  } catch (error) {
    console.error(error);
    throw createHttpError(
      500,
      'Something went wrong while deleting membership.'
    );
  }
}
