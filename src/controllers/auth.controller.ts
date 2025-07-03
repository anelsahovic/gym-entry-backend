import { RequestHandler } from 'express';
import { LoginUserBody } from '../zodSchemas/schemas';
import createHttpError from 'http-errors';
import { getUserFromDb, loginUser } from '../services/auth.service';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await getUserFromDb(req.session.userId!);

    res.status(200).json({
      userId: user?.id,
      email: user?.email,
      name: user?.name,
      username: user?.username,
      role: user?.role,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const login: RequestHandler<
  unknown,
  unknown,
  LoginUserBody,
  unknown
> = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const loggedInUser = await loginUser({ username, password });

    if (!loggedInUser) throw createHttpError(404, 'User not found.');

    req.session.userId = loggedInUser.id;
    req.session.save();
    res.status(200).json(loggedInUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
