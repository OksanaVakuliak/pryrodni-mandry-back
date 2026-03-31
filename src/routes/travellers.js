import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getTravellerProfile,
  getTravellerStories,
  getTravellers,
} from '../controllers/travellerController.js';
import {
  paginationQuerySchema,
  validIdSchema,
} from '../validations/commonValidation.js';

const router = Router();

router.get('/', celebrate(paginationQuerySchema), getTravellers);

router.get('/:id', celebrate(validIdSchema), getTravellerProfile);
router.get(
  '/:id/stories',
  celebrate({ ...validIdSchema, ...paginationQuerySchema }),
  getTravellerStories,
);

export default router;
