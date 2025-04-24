import express from 'express';
import * as MembersController from '../controllers/members.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateMemberSchema, UpdateMemberSchema } from '../zodSchemas/schemas';

const router = express.Router();

router.get('/', MembersController.index);

router.get('/:memberId', MembersController.show);

router.get('/scan/:uniqueId', MembersController.scan);

router.post('/', validateRequest(CreateMemberSchema), MembersController.store);

router.put(
  '/:memberId',
  validateRequest(UpdateMemberSchema),
  MembersController.update
);

router.patch('/:memberId/membership', MembersController.extend);

router.delete('/:memberId', MembersController.destroy);

export default router;
