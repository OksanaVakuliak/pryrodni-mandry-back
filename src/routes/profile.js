import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getMyProfile,
  getMyStories,
  getSavedStories,
} from '../controllers/profileController.js';
import { getSavedStoriesSchema } from '../validations/storyValidation.js';
import { celebrate } from 'celebrate';

const router = Router();

router.get('/profile/me', authenticate, getMyProfile);
router.get('/profile/my-stories', authenticate, getMyStories);
router.get(
  '/profile/saved-stories',
  authenticate,
  celebrate(getSavedStoriesSchema),
  getSavedStories,
);

export default router;
