import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  getAllStories,
  getPopularStories,
  getRecommendedStories,
} from '../controllers/storyController.js';
import { getAllStoriesSchema } from '../validations/storyValidation.js';

const storiesRouter = Router();

storiesRouter.get('/stories', celebrate(getAllStoriesSchema), getAllStories);

storiesRouter.get(
  '/stories/popular',
  celebrate(getAllStoriesSchema),
  getPopularStories,
);

storiesRouter.get('/stories/:id/recommended', getRecommendedStories);

export default storiesRouter;
