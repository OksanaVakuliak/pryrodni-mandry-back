import mongoose from 'mongoose';
import Story from '../models/story.js';
import createHttpError from 'http-errors';

const getAllStories = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 6);
  const { category } = req.query;

  const filter = {};
  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw createHttpError(400, 'Category query parameter is required');
    }

    filter.category = new mongoose.Types.ObjectId(category);
  }

  const [stories, totalItems] = await Promise.all([
    Story.find(filter)
      .sort({ rate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('ownerId', 'name avatar')
      .populate('category', 'name'),

    Story.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;

  res.status(200).json({
    currentPage: page,
    totalPages,
    totalItems,
    hasNextPage,
    data: stories,
  });
};

export default getAllStories;
