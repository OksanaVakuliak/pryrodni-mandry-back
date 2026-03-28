import { celebrate } from 'celebrate';
import { Router } from 'express';

import { upload } from '../middleware/multer.js';
import { authenticate } from '../middleware/authenticate.js';

import {
  getAllStories,
  getPopularStories,
  getRecommendedStories,
  postSaveStory,
  deleteSaveStory,
  createStory,
} from '../controllers/storyController.js';
import {
  getAllStoriesSchema,
  createStorySchema,
  patchSaveStorySchema,
} from '../validations/storyValidation.js';

const storiesRouter = Router();

storiesRouter.get('/stories', celebrate(getAllStoriesSchema), getAllStories);

storiesRouter.get('/stories/popular', getPopularStories);

storiesRouter.get('/stories/:id/recommended', getRecommendedStories);

storiesRouter.patch(
  '/stories/:id/save',
  authenticate,
  celebrate(patchSaveStorySchema),
  postSaveStory,
);

storiesRouter.patch(
  '/stories/:id/delete',
  authenticate,
  celebrate(patchSaveStorySchema),
  deleteSaveStory,
);

storiesRouter.post(
  '/stories',
  authenticate,
  upload.single('image'),
  celebrate(createStorySchema),
  createStory,
);

export default storiesRouter;
