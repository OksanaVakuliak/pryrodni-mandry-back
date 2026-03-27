import mongoose from 'mongoose';
import Story from '../models/story.js';
import createHttpError from 'http-errors';

export const getAllStories = async (req, res) => {
  const { page = 1, perPage = 6, category } = req.query;
  const skip = (page - 1) * perPage;

  const filter = {};
  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw createHttpError(400, 'Category query parameter is required');
    }

    filter.category = new mongoose.Types.ObjectId(category);
  }

  const [stories, totalStories] = await Promise.all([
    Story.find(filter)
      .sort({ rate: -1 })
      .skip(skip)
      .limit(perPage)
      .populate('ownerId', 'name avatar')
      .populate('category', 'name'),

    Story.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalStories / perPage);
  const hasNextPage = page < totalPages;

  res.status(200).json({
    page,
    perPage,
    totalPages,
    totalStories,
    hasNextPage,
    stories,
  });
};

export const getPopularStories = async (req, res) => {
  const popularStories = await Story.find({
    'savedByUsers.0': { $exists: true },
  })
    .sort({ rate: -1 })
    .limit(10)
    .populate('ownerId', 'name avatar')
    .populate('category', 'name');

  res.status(200).json(popularStories);
};

export const getRecommendedStories = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid story ID');
  }

  const currentStory = await Story.findById(id);
  if (!currentStory) {
    throw createHttpError(404, 'Story not found');
  }

  const stories = await Story.find({
    category: currentStory.category,
    _id: { $ne: id },
  })
    .limit(3)
    .populate('ownerId', 'name avatar')
    .populate('category', 'name');

  res.status(200).json(stories);
};
