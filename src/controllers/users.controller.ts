import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  resetUserPassword,
  updateUser,
  updateUserPassword,
} from '../services/users.service';
import {
  DeleteUserParams,
  ResetUserPasswordParams,
  ShowUserParams,
  UpdateUserParams,
  UpdateUserPasswordParams,
} from '../types/index.types';
import {
  CreateUserBody,
  ResetUserPasswordBody,
  UpdateUserBody,
  UpdateUserPasswordBody,
} from '../zodSchemas/schemas';

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
  const { name, username, email, role, password } = req.body;
  try {
    const userData = { name, username, email, role, password };

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
  const { name, username, email, role } = req.body;

  try {
    if (!userId) throw createHttpError(400, 'Please provide user ID.');

    const updatedUserData = { name, username, email, role };

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

export const resetPassword: RequestHandler<
  ResetUserPasswordParams,
  unknown,
  ResetUserPasswordBody,
  unknown
> = async (req, res, next) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    if (!userId) throw createHttpError(400, 'Please provide user ID.');

    const updatedUser = await resetUserPassword(userId, password);

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
