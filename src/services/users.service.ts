import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { CreateUserBody, UpdateUserBody } from '../zodSchemas/schemas';

const prisma = new PrismaClient();

export async function getUsers() {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
  });
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
  const userByUsername = await prisma.user.findUnique({
    where: {
      username: userData.username,
    },
  });

  if (userByUsername)
    throw createHttpError(409, 'User with that username already exists.');

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
      username: userData.username,
      email: userData.email,
      role: userData.role,
      password: hashedPassword,
    },
    omit: {
      password: true,
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

  const userWithSameUsername = await prisma.user.findFirst({
    where: {
      username: newUserData.username,
      id: {
        not: userId,
      },
    },
  });

  if (userWithSameUsername)
    throw createHttpError(409, 'User with that username already exists.');

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
      username: newUserData.username,
      email: newUserData.email,
      role: newUserData.role,
    },
    omit: {
      password: true,
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
    omit: {
      password: true,
    },
  });
}
export async function resetUserPassword(userId: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw createHttpError(404, "User doesn't exist.");

  if (await bcrypt.compare(password, user.password))
    throw createHttpError(
      400,
      'New password must be different from the old password.'
    );

  const newHashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newHashedPassword,
    },
    omit: {
      password: true,
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
