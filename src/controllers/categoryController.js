import Category from '../models/category.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });

    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
