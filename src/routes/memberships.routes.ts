import express, { RequestHandler } from 'express';
import * as MembershipsController from '../controllers/memberships.controller';
import { validateRequest } from '../middlewares/validateRequest';
import {
  CreateMembershipSchema,
  UpdateMembershipSchema,
} from '../zodSchemas/schemas';
import { requireAdmin } from '../middlewares/auth';
import {
  DeleteMembershipParams,
  UpdateMembershipParams,
} from '../types/index.types';

const router = express.Router();

router.get('/', MembershipsController.index);

router.get('/:membershipId', MembershipsController.show);

router.post(
  '/',
  requireAdmin,
  validateRequest(CreateMembershipSchema),
  MembershipsController.store
);

router.put(
  '/:membershipId',
  requireAdmin as unknown as RequestHandler<UpdateMembershipParams>,
  validateRequest(UpdateMembershipSchema),
  MembershipsController.update
);

router.delete(
  '/:membershipId',
  requireAdmin as unknown as RequestHandler<DeleteMembershipParams>,
  MembershipsController.destroy
);

export default router;
