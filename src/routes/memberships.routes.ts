import express from 'express';
import * as MembershipsController from '../controllers/memberships.controller';
import { validateRequest } from '../middlewares/validateRequest';
import {
  CreateMembershipSchema,
  UpdateMembershipSchema,
} from '../zodSchemas/schemas';

const router = express.Router();

router.get('/', MembershipsController.index);

router.get('/:membershipId', MembershipsController.show);

router.post(
  '/',
  validateRequest(CreateMembershipSchema),
  MembershipsController.store
);

router.put(
  '/:membershipId',
  validateRequest(UpdateMembershipSchema),
  MembershipsController.update
);

router.delete('/:membershipId', MembershipsController.destroy);

export default router;
