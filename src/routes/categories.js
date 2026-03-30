import express from 'express';
import { getAllCategories } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/api/categories', getAllCategories);

export default router;
