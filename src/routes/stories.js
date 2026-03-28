import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getStoryByIdSchema } from '../validations/storyValidation.js';
import { getStoryById } from '../controllers/storyController.js';

const storiesRouter = Router();

storiesRouter.get('/stories/:id', celebrate(getStoryByIdSchema), getStoryById);

export default storiesRouter;
