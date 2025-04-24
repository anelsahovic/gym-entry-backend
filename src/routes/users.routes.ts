import express from 'express';
import * as UsersController from '../controllers/users.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateUserSchema, UpdateUserSchema } from '../zodSchemas/schemas';

const router = express.Router();

router.get('/', UsersController.index);

router.get('/:userId', UsersController.show);

router.post('/', validateRequest(CreateUserSchema), UsersController.store);

router.put(
  '/:userId',
  validateRequest(UpdateUserSchema),
  UsersController.update
);

router.patch('/:userId/password', UsersController.updatePassword);

router.delete('/:userId', UsersController.destroy);

export default router;
