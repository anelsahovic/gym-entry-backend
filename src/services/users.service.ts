import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { CreateUserBody, UpdateUserBody } from '../zodSchemas/schemas';

const prisma = new PrismaClient();

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
}

export async function createUser(userData: CreateUserBody) {
  const userByEmail = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (userByEmail)
    throw createHttpError(409, 'User with that e-mail already exists.');

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: hashedPassword,
    },
  });
}

export async function updateUser(userId: string, newUserData: UpdateUserBody) {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) throw createHttpError(404, "User doesn't exist.");

  const userWithSameEmail = await prisma.user.findFirst({
    where: {
      email: newUserData.email,
      id: {
        not: userId,
      },
    },
  });

  if (userWithSameEmail)
    throw createHttpError(409, 'User with that email already exists.');

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
    },
  });
}

export async function updateUserPassword(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw createHttpError(404, "User doesn't exist.");

  const validOldPassword = await bcrypt.compare(oldPassword, user.password);

  if (!validOldPassword)
    throw createHttpError(400, 'Please enter correct old password.');

  if (await bcrypt.compare(newPassword, user.password))
    throw createHttpError(
      400,
      'New password must be different from the old password.'
    );

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newHashedPassword,
    },
  });
}

export async function deleteUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw createHttpError(404, 'User not found.');

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw createHttpError(500, 'Something went wrong while deleting user.');
  }
}
