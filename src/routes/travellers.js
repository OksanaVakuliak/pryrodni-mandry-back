import { Router } from 'express';
import { celebrate } from 'celebrate';
import * as travellersController from '../controllers/travellerController.js';
import { getTravellersSchema } from '../validations/travellersValidation.js';

const router = Router();

router.get(
  '/',
  celebrate(getTravellersSchema),
  travellersController.getTravellers,
);

export default router;
