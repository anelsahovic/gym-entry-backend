import express from 'express';
import * as AuthController from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { LoginUserSchema } from '../zodSchemas/schemas';
import { requireAuth } from '../middlewares/auth';

const router = express.Router();

router.get('/', requireAuth, AuthController.getAuthenticatedUser);

router.post('/login', validateRequest(LoginUserSchema), AuthController.login);

router.post('/logout', AuthController.logout);

export default router;
