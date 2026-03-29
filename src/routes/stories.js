import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllStories,
  getPopularStories,
  getRecommendedStories,
  postSaveStory,
  deleteSaveStory,
  createStory,
  getStoryById,
} from '../controllers/storyController.js';
import {
  createStorySchema,
  getAllStoriesSchema,
  patchSaveStorySchema,
  getStoryByIdSchema,
} from '../validations/storyValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

const storiesRouter = Router();

storiesRouter.get(
  '/api/stories',
  celebrate(getAllStoriesSchema),
  getAllStories,
);

storiesRouter.get('/api/stories/popular', getPopularStories);

storiesRouter.get('/api/stories/:id/recommended', getRecommendedStories);

storiesRouter.get(
  '/api/stories/:id',
  celebrate(getStoryByIdSchema),
  getStoryById,
);

storiesRouter.patch(
  '/api/stories/:id/save',
  authenticate,
  celebrate(patchSaveStorySchema),
  postSaveStory,
);

storiesRouter.patch(
  '/api/stories/:id/delete',
  authenticate,
  celebrate(patchSaveStorySchema),
  deleteSaveStory,
);

storiesRouter.post(
  '/api/stories',
  authenticate,
  upload.single('img'),
  celebrate(createStorySchema),
  createStory,
);

export default storiesRouter;
