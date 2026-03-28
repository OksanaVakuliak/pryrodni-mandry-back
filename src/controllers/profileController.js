import createHttpError from 'http-errors';
import User from '../models/user.js';
import Story from '../models/story.js';
import bcrypt from 'bcrypt';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getMyProfile = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw createHttpError(401, 'Unauthorized');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({ status: 200, data: user });
};

export const getMyStories = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw createHttpError(401, 'Unauthorized');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const storiesQuery = Story.find({ ownerId: userId })
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .populate('category', 'name');

  const [stories, totalItems] = await Promise.all([
    storiesQuery,
    Story.countDocuments({ ownerId: userId }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    status: 200,
    data: {
      stories,
      totalItems,
      totalPages,
      currentPage: page,
      hasNextPage: totalPages > page,
      hasPreviousPage: page > 1,
    },
  });
};

export const getSavedStories = async (req, res) => {
  const { page = 1, perPage = 6 } = req.query;
  const skip = (page - 1) * perPage;
  const userId = req.user._id;

  const filter = { savedByUsers: userId };

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

export const updateProfile = async (req, res, next) => {
  const updates = {};

  if (req.body.name) {
    updates.name = req.body.name;
  }

  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    updates.password = hashedPassword;
  }

  if (req.file) {
    const avatarUrl = await saveFileToCloudinary(req.file);
    updates.avatar = avatarUrl;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { returnDocument: 'after' }
  ).select('-password');

  return res.status(200).json(user);
};
