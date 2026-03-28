import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getMyProfile,
  getMyStories,
} from '../controllers/profileController.js';

const router = Router();

router.get('/profile/me', authenticate, getMyProfile);
router.get('/profile/my-stories', authenticate, getMyStories);

export default router;
