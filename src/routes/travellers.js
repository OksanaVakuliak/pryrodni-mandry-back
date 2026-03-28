import { Router } from 'express';
import { celebrate } from 'celebrate';
import * as travellersController from '../controllers/travellerController.js';
import { getTravellersSchema } from '../validations/travellersValidation.js';
import { isValidId } from '../middleware/isValidId.js';
import {
  getTravellerProfile,
  getTravellerStories,
} from '../services/travellerService.js';

const router = Router();

router.get(
  '/travellers',
  celebrate(getTravellersSchema),
  travellersController.getTravellers,
);

router.get('/travellers/:id', isValidId, getTravellerProfile);
router.get('/travellers/:id/stories', isValidId, getTravellerStories);

export default router;
