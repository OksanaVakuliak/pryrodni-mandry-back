import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import Story from '../models/story.js';
import getUploadedFile from '../utils/fileUpload.js';
import parsePagination from '../utils/pagination.js';
import {
  saveStoryForUser,
  unsaveStoryForUser,
} from '../services/storyService.js';

export const getStoryById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid story ID');
  }

  const story = await Story.findById(id)
    .populate('ownerId', 'name avatar')
    .populate('category', 'name');

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
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw createHttpError(400, 'Category query parameter is required');
    }

    filter.category = new mongoose.Types.ObjectId(category);
  }

  const baseQuery = Story.find(filter)
    .sort({ rate: -1 })
    .populate('ownerId', 'name avatar')
    .populate('category', 'name');

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

export const postSaveStory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid story ID');
  }

  const finalStory = await saveStoryForUser(id, userId);

  res.status(200).json({
    isSaved: true,
    savesCount: finalStory.savedByUsers.length,
    message: 'Story saved successfully',
  });
};

export const deleteSaveStory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid story ID');
  }

  const finalStory = await unsaveStoryForUser(id, userId);

  res.status(200).json({
    isSaved: false,
    savesCount: finalStory.savedByUsers.length,
    message: 'Story unsaved successfully',
  });
};

export const createStory = async (req, res, next) => {
  try {
    const { title, article, category } = req.body;

    if (!title || !article || !category) {
      throw createHttpError(400, 'Missing required fields');
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw createHttpError(400, 'Invalid category id');
    }

    const uploadedFile = getUploadedFile(req);
    if (!uploadedFile || !uploadedFile.buffer) {
      throw createHttpError(400, 'No image file provided');
    }

    const buffer = Buffer.isBuffer(uploadedFile.buffer)
      ? uploadedFile.buffer
      : Buffer.from(uploadedFile.buffer);

    const publicId = `story_${req.user._id}_${Date.now()}`;
    const result = await saveFileToCloudinary({ buffer }, 'stories', publicId);

    if (!result) {
      throw createHttpError(500, 'Image upload failed');
    }

    const story = await Story.create({
      title: title.trim(),
      article,
      img: result,
      category: new mongoose.Types.ObjectId(category),
      ownerId: new mongoose.Types.ObjectId(req.user._id),
      date: new Date().toISOString(),
    });

    const populated = await Story.findById(story._id)
      .populate('ownerId', 'name avatar')
      .populate('category', 'name');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};
