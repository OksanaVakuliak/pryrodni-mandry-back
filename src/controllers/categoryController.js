import Category from '../models/category.js';
import createHttpError from 'http-errors';

export const getAllCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ category: 1 });

  if (!categories) {
    throw createHttpError(404, 'Categories not found');
  }

  return res.status(200).json(categories);
};
