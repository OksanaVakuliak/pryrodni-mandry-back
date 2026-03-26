import Category from '../models/category.js';
import { getCategoriesQuerySchema } from '../validations/categoryValidation.js';

export const getAllCategories = async (req, res) => {
  try {
    const { error } = getCategoriesQuerySchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const categories = await Category.find({}).sort({ name: 1 });

    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
