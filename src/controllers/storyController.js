import { mongoose } from 'mongoose';
import { Story } from '../models/story.js';
import createHttpError from 'http-errors';

const getStories = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 6);
  const { category } = req.query;

  const filter = {};
  if (!category) {
    throw createHttpError(400, 'Category query parameter is required');
  }
  filter.category = new mongoose.Types.ObjectId(category);

  const [stories, totalItems] = await Promise.all([
    Story.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name avatar')
      .populate('category', 'name'),

    Story.countDocuments(filter),
  ]);

  const totalPage = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPage;

  res.status(200).json({
    currentPage: page,
    totalPage,
    totalItems,
    hasNextPage,
    data: stories,
  });
};

export default getStories;
