import { celebrate } from 'celebrate';
import { Router } from 'express';
import { createStory } from '../controllers/storyController.js';
import { createStorySchema } from '../validations/storyValidation.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.post(
  '/stories',
  authenticate,
  upload.single('image'),
  celebrate(createStorySchema),
  createStory,
);

export default router;
