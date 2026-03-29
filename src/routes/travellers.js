import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getTravellersSchema } from '../validations/travellersValidation.js';
import { isValidId } from '../middleware/isValidId.js';
import {
  getTravellerProfile,
  getTravellerStories,
  getTravellers,
} from '../controllers/travellerController.js';

const router = Router();

router.get('/api/travellers', celebrate(getTravellersSchema), getTravellers);

router.get('/api/travellers/:id', isValidId, getTravellerProfile);
router.get('/api/travellers/:id/stories', isValidId, getTravellerStories);

export default router;
