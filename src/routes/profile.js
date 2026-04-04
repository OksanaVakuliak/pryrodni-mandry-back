import { Router } from 'express';
import {
  getMyProfile,
  getMyStories,
  getSavedStories,
  updateAvatar,
  // updateProfile,
} from '../controllers/profileController.js';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { paginationQuerySchema } from '../validations/commonValidation.js';
// import { updateProfileSchema } from '../validations/userValidation.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMyProfile);
router.get('/my-stories', celebrate(paginationQuerySchema), getMyStories);
router.get('/saved-stories', celebrate(paginationQuerySchema), getSavedStories);

router.patch('/avatar', upload.single('avatar'), updateAvatar);
// router.patch(
//   '/edit',
//   upload.single('avatar'),
//   celebrate(updateProfileSchema),
//   updateProfile,
// );

export default router;
