import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getMyProfile,
  getMyStories,
  getSavedStories,
  updateProfile,
} from '../controllers/profileController.js';
import { getSavedStoriesSchema } from '../validations/storyValidation.js';
import { celebrate } from 'celebrate';
import { updateProfileSchema } from '../validations/userValidation.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.get('/api/profile/me', authenticate, getMyProfile);
router.get('/api/profile/my-stories', authenticate, getMyStories);
router.get(
  '/api/profile/saved-stories',
  authenticate,
  celebrate(getSavedStoriesSchema),
  getSavedStories,
);

router.patch(
  '/api/profile/edit',
  authenticate,
  upload.single('avatar'),
  celebrate(updateProfileSchema),
  updateProfile,
);

export default router;
