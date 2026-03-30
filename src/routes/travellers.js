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

router.get('/api/travellers', celebrate(paginationQuerySchema), getTravellers);

router.get(
  '/api/travellers/:id',
  celebrate(validIdSchema),
  getTravellerProfile,
);
router.get(
  '/api/travellers/:id/stories',
  celebrate(validIdSchema),
  celebrate(paginationQuerySchema),
  getTravellerStories,
);

export default router;
