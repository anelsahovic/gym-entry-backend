import { PrismaClient } from '@prisma/client';
import { LoginUserBody } from '../zodSchemas/schemas';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function getUserFromDb(authUserId: string) {
  return await prisma.user.findUnique({
    omit: {
      password: true,
    },
    where: {
      id: authUserId,
    },
  });
}

export async function loginUser(loginData: LoginUserBody) {
  const fetchedUser = await prisma.user.findUnique({
    where: {
      email: loginData.email,
    },
  });

  if (!fetchedUser)
    throw createHttpError(404, "User with that email doesn't exist");

  const passwordMatched = await bcrypt.compare(
    loginData.password,
    fetchedUser.password
  );

  if (!passwordMatched) throw createHttpError(401, 'Incorrect password.');

  return fetchedUser;
}
