import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllStories,
  getPopularStories,
  getRecommendedStories,
  createStory,
  getStoryById,
  patchUnsaveStory,
  patchSaveStory,
} from '../controllers/storyController.js';
import {
  createStorySchema,
  getAllStoriesSchema,
} from '../validations/storyValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
import {
  paginationQuerySchema,
  validIdSchema,
} from '../validations/commonValidation.js';

const storiesRouter = Router();

storiesRouter.get(
  '/api/stories',
  celebrate(paginationQuerySchema),
  celebrate(getAllStoriesSchema),
  getAllStories,
);

storiesRouter.get(
  '/api/stories/popular',
  celebrate(paginationQuerySchema),
  getPopularStories,
);

storiesRouter.get(
  '/api/stories/:id/recommended',
  celebrate(validIdSchema),
  getRecommendedStories,
);

storiesRouter.get('/api/stories/:id', celebrate(validIdSchema), getStoryById);

storiesRouter.patch(
  '/api/stories/:id/save',
  authenticate,
  celebrate(validIdSchema),
  patchSaveStory,
);

storiesRouter.patch(
  '/api/stories/:id/delete',
  authenticate,
  celebrate(validIdSchema),
  patchUnsaveStory,
);

storiesRouter.post(
  '/api/stories',
  authenticate,
  upload.single('img'),
  celebrate(createStorySchema),
  createStory,
);

export default storiesRouter;
