import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  getAllStories,
  getPopularStories,
  getRecommendedStories,
  postSaveStory,
  deleteSaveStory,
} from '../controllers/storyController.js';
import { getAllStoriesSchema } from '../validations/storyValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const storiesRouter = Router();

storiesRouter.get('/stories', celebrate(getAllStoriesSchema), getAllStories);

storiesRouter.get('/stories/popular', getPopularStories);

storiesRouter.get('/stories/:id/recommended', getRecommendedStories);

storiesRouter.post('/stories/:id/save', authenticate, postSaveStory);

storiesRouter.delete('/stories/:id/delete', authenticate, deleteSaveStory);

export default storiesRouter;
