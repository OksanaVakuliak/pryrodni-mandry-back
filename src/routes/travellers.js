import { Router } from 'express';
import { celebrate } from 'celebrate';
import * as travellersController from '../controllers/travellerController.js';
import { getTravellersSchema } from '../validations/travellersValidation.js';
import { isValidId } from '../middleware/isValidId.js';

const router = Router();

router.get(
  '/travellers',
  celebrate(getTravellersSchema),
  travellersController.getTravellers,
);

router.get('/:id', isValidId, travellersController.getTravellerProfile);
router.get('/:id/stories', isValidId, travellersController.getTravellerStories);

export default router;
