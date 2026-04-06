import { Router } from 'express';
import {
  getMyProfile,
  getMyStories,
  getSavedStories,
  updateAvatar,
  requestProfileUpdate,
  confirmProfileUpdate,
} from '../controllers/profileController.js';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { paginationQuerySchema } from '../validations/commonValidation.js';
import {
  confirmProfileUpdateSchema,
  updateProfileRequestSchema,
} from '../validations/userValidation.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMyProfile);
router.get('/my-stories', celebrate(paginationQuerySchema), getMyStories);
router.get('/saved-stories', celebrate(paginationQuerySchema), getSavedStories);

router.patch('/avatar', upload.single('avatarUrl'), updateAvatar);
router.post(
  '/update-request',
  celebrate(updateProfileRequestSchema),
  requestProfileUpdate,
);
router.post(
  '/update-confirm',
  celebrate(confirmProfileUpdateSchema),
  confirmProfileUpdate,
);

export default router;
