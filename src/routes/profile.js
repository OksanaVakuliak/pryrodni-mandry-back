import { Router } from 'express';
import {
  getMyProfile,
  getMyStories,
  getSavedStories,
  // updateProfile,
} from '../controllers/profileController.js';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { paginationQuerySchema } from '../validations/commonValidation.js';
// import { updateProfileSchema } from '../validations/userValidation.js';
// import { upload } from '../middleware/multer.js';

const router = Router();

router.use(authenticate);

router.get('/api/profile/me', getMyProfile);
router.get(
  '/api/profile/my-stories',
  celebrate(paginationQuerySchema),
  getMyStories,
);
router.get(
  '/api/profile/saved-stories',
  celebrate(paginationQuerySchema),
  getSavedStories,
);

// router.patch(
//   '/api/profile/edit',
//   upload.single('avatar'),
//   celebrate(updateProfileSchema),
//   updateProfile,
// );

export default router;
