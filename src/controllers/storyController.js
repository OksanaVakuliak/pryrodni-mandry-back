import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import Story from '../models/story.js';
import User from '../models/user.js';
import getUploadedFile from '../utils/fileUpload.js';
import parsePagination from '../utils/pagination.js';

export const getStoryById = async (req, res) => {
  const { id } = req.params;

  const story = await Story.findById(id)
    .populate('ownerId', 'name avatarUrl')
    .populate('category', 'category');

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json({
    status: 200,
    data: story,
  });
};

export const getAllStories = async (req, res) => {
  const { page, perPage, skip } = parsePagination(req.query);

  const filter = {};
  const category = req.query.category;
  if (category) {
    filter.category = new mongoose.Types.ObjectId(category);
  }

  const baseQuery = Story.find(filter)
    .sort({ rate: -1 })
    .populate('ownerId', 'name avatarUrl')
    .populate('category', 'category');

  const [stories, totalStories] = await Promise.all([
    baseQuery.clone().skip(skip).limit(perPage),
    baseQuery.clone().countDocuments(),
  ]);

  const totalPages = Math.ceil(totalStories / perPage);
  const hasNextPage = page < totalPages;

  res
    .status(200)
    .json({ page, perPage, totalPages, totalStories, hasNextPage, stories });
};

export const getPopularStories = async (req, res) => {
  const popularStories = await Story.find({
    'savedByUsers.0': { $exists: true },
  })
    .sort({ rate: -1 })
    .limit(10)
    .populate('ownerId', 'name avatarUrl')
    .populate('category', 'category');

  res.status(200).json(popularStories);
};

export const getRecommendedStories = async (req, res) => {
  const { id } = req.params;

  const currentStory = await Story.findById(id);
  if (!currentStory) {
    throw createHttpError(404, 'Story not found');
  }

  const stories = await Story.find({
    category: currentStory.category,
    _id: { $ne: id },
  })
    .limit(3)
    .populate('ownerId', 'name avatarUrl')
    .populate('category', 'category');

  res.status(200).json(stories);
};

export const patchSaveStory = async (req, res) => {
  const { id: storyId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (user.savedArticles.includes(storyId)) {
    throw createHttpError(409, 'Story already saved');
  }

  const incrementStoryRate = Story.findByIdAndUpdate(
    storyId,
    { $inc: { rate: 1 } },
    { returnDocument: 'after' },
  );

  const pushArticleToUser = User.findByIdAndUpdate(
    userId,
    { $push: { savedArticles: storyId } },
    { returnDocument: 'after' },
  );

  const [updatedStory, updatedUser] = await Promise.all([
    incrementStoryRate,
    pushArticleToUser,
  ]);

  if (!updatedStory) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Story saved successfully',
    data: {
      rate: updatedStory.rate,
      savedArticles: updatedUser.savedArticles,
    },
  });
};

export const patchUnsaveStory = async (req, res) => {
  const { id: storyId } = req.params;
  const userId = req.user._id;

  const updateStoryRate = Story.findByIdAndUpdate(
    storyId,
    { $inc: { rate: -1 } },
    { returnDocument: 'after' },
  );

  const updateUserSavedList = User.findByIdAndUpdate(
    userId,
    { $pull: { savedArticles: storyId } },
    { returnDocument: 'after' },
  );

  const [updatedStory, updatedUser] = await Promise.all([
    updateStoryRate,
    updateUserSavedList,
  ]);

  if (!updatedStory) {
    throw createHttpError(404, 'Story not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Story unsaved successfully',
    data: {
      rate: updatedStory.rate,
      savedArticles: updatedUser.savedArticles,
    },
  });
};

export const createStory = async (req, res, next) => {
  const { title, article, category } = req.body;
  const userId = req.user._id;

  if (!title || !article || !category) {
    throw createHttpError(400, 'Missing required fields');
  }

  const uploadedFile = getUploadedFile(req);
  if (!uploadedFile || !uploadedFile.buffer) {
    throw createHttpError(400, 'No image file provided');
  }

  if (!req.file) {
    throw createHttpError(400, 'Field name must be "img" and file is required');
  }

  const buffer = Buffer.isBuffer(uploadedFile.buffer)
    ? uploadedFile.buffer
    : Buffer.from(uploadedFile.buffer);

  const publicId = `story_${req.user._id}_${Date.now()}`;
  const result = await saveFileToCloudinary({ buffer }, 'stories', publicId);

  if (!result) {
    throw createHttpError(500, 'Image upload failed');
  }

  const storyData = {
    title: title.trim(),
    article,
    img: result,
    category: new mongoose.Types.ObjectId(category),
    ownerId: req.user._id,
    date: new Date().toISOString(),
  };

  const createStoryPromise = Story.create(storyData);
  const updateUserStatsPromise = User.findByIdAndUpdate(userId, {
    $inc: { articlesAmount: 1 },
  });

  const [story] = await Promise.all([
    createStoryPromise,
    updateUserStatsPromise,
  ]);

  const populated = await Story.findById(story._id)
    .populate('ownerId', 'name avatarUrl')
    .populate('category', 'category');

  res.status(201).json(populated);
};
