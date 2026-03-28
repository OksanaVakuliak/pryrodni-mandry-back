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

router.get('/travellers', celebrate(getTravellersSchema), getTravellers);

router.get('/travellers/:id', isValidId, getTravellerProfile);
router.get('/travellers/:id/stories', isValidId, getTravellerStories);

export default router;
