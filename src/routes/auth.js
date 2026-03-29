import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/api/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/api/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/api/auth/logout', authenticate, logoutUser);
router.post('/api/auth/refresh', authenticate, refreshUserSession);

export default router;
