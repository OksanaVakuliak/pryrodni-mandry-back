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

storiesRouter.get('/', celebrate(getAllStoriesSchema), getAllStories);

storiesRouter.get(
  '/popular',
  celebrate(paginationQuerySchema),
  getPopularStories,
);

storiesRouter.get(
  '/:id/recommended',
  celebrate(validIdSchema),
  getRecommendedStories,
);

storiesRouter.get('/:id', celebrate(validIdSchema), getStoryById);

storiesRouter.patch(
  '/:id/save',
  authenticate,
  celebrate(validIdSchema),
  patchSaveStory,
);

storiesRouter.patch(
  '/:id/delete',
  authenticate,
  celebrate(validIdSchema),
  patchUnsaveStory,
);

storiesRouter.post(
  '/',
  authenticate,
  upload.single('img'),
  celebrate(createStorySchema),
  createStory,
);

export default storiesRouter;
