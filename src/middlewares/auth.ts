import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getUserFromDb } from '../services/auth.service';

export const requireAuth: RequestHandler = (req, res, next) => {
  //Authentication has been temporarily disabled for demo purposes. In production, full auth is enabled.
  return next();

  // if (req.session.userId) {
  //   next();
  // } else {
  //   next(createHttpError(401, 'Not authenticated'));
  // }
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    // if (!req.session.userId) {
    //   return next(createHttpError(401, 'Not authenticated.'));
    // }

    // const user = await getUserFromDb(req.session.userId);

    // Check if user has the admin role

    // if (!user || user.role !== 'ADMIN') {
    //   return next(createHttpError(403, 'You need Admin role to do that.'));
    // }

    // If the user has admin privileges, proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Internal Server Error.'));
  }
};
