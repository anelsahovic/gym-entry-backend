import express, { RequestHandler } from 'express';
import * as UsersController from '../controllers/users.controller';
import { validateRequest } from '../middlewares/validateRequest';
import {
  CreateUserSchema,
  ResetUserPasswordSchema,
  UpdateUserPasswordSchema,
  UpdateUserSchema,
} from '../zodSchemas/schemas';
import { requireAdmin } from '../middlewares/auth';
import {
  DeleteUserParams,
  ResetUserPasswordParams,
  UpdateUserParams,
} from '../types/index.types';

const router = express.Router();

router.get('/', requireAdmin, UsersController.index);

router.get('/:userId', UsersController.show);

router.post(
  '/',
  requireAdmin,
  validateRequest(CreateUserSchema),
  UsersController.store
);

router.put(
  '/:userId',
  requireAdmin as unknown as RequestHandler<UpdateUserParams>,

  validateRequest(UpdateUserSchema),
  UsersController.update
);

router.patch(
  '/:userId/update-password',
  validateRequest(UpdateUserPasswordSchema),
  UsersController.updatePassword
);

router.patch(
  '/:userId/reset-password',
  requireAdmin as unknown as RequestHandler<ResetUserPasswordParams>,
  validateRequest(ResetUserPasswordSchema),
  UsersController.resetPassword
);

router.delete(
  '/:userId',
  requireAdmin as unknown as RequestHandler<DeleteUserParams>,
  UsersController.destroy
);

export default router;
