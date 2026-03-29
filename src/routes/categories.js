import express from 'express';
import { celebrate } from 'celebrate';
import { getAllCategories } from '../controllers/categoryController.js';
import { createCategorySchema } from '../validations/categoryValidation.js';

const router = express.Router();

router.get(
  '/api/categories',
  celebrate(createCategorySchema),
  getAllCategories,
);

export default router;
