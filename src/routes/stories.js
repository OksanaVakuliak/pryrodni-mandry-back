import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  getAllStories,
  getPopularStories,
  getRecommendedStories,
  postSaveStory,
  deleteSaveStory,
  createStory,
} from '../controllers/storyController.js';
import {
  createStorySchema,
  getAllStoriesSchema,
  patchSaveStorySchema,
} from '../validations/storyValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

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
  upload.single('img'),
  celebrate(createStorySchema),
  createStory,
);

export default storiesRouter;
