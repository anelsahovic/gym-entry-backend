import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserPassword,
} from '../services/users.service';
import {
  DeleteUserParams,
  ShowUserParams,
  UpdateUserParams,
  UpdateUserPasswordBody,
  UpdateUserPasswordParams,
} from '../types/index.types';
import { CreateUserBody, UpdateUserBody } from '../zodSchemas/schemas';

export const index: RequestHandler = async (req, res, next) => {
  try {
    const users = await getUsers();

    if (!users || !users.length) throw createHttpError(404, 'No users found.');

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const show: RequestHandler<
  ShowUserParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) throw createHttpError(400, 'Please provide user ID.');

    const user = await getUserById(userId);

    if (!user) throw createHttpError(404, 'No user found.');

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const store: RequestHandler<
  unknown,
  unknown,
  CreateUserBody,
  unknown
> = async (req, res, next) => {
  const { name, email, role, password } = req.body;
  try {
    const userData = { name, email, role, password };

    const user = await createUser(userData);

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update: RequestHandler<
  UpdateUserParams,
  unknown,
  UpdateUserBody,
  unknown
> = async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;

  try {
    if (!userId) throw createHttpError(400, 'Please provide user ID.');

    const updatedUserData = { name, email, role };

    const updatedUser = await updateUser(userId, updatedUserData);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updatePassword: RequestHandler<
  UpdateUserPasswordParams,
  unknown,
  UpdateUserPasswordBody,
  unknown
> = async (req, res, next) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    if (!userId) throw createHttpError(400, 'Please provide user ID.');

    if (!oldPassword) throw createHttpError(400, 'Old password required.');
    if (!newPassword) throw createHttpError(400, 'New password required.');

    const updatedUser = await updateUserPassword(
      userId,
      oldPassword,
      newPassword
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const destroy: RequestHandler<
  DeleteUserParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) throw createHttpError(400, 'Please provide user ID.');

    await deleteUser(userId);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
