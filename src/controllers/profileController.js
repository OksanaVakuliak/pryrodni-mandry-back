import createHttpError from 'http-errors';
import User from '../models/user.js';
import Story from '../models/story.js';
import parsePagination from '../utils/pagination.js';
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

  const {
    page,
    perPage: limit,
    skip,
  } = parsePagination(req.query, { page: 1, perPage: 6 });

  const baseQuery = Story.find({ ownerId: userId })
    .sort({ _id: -1 })
    .populate('category', 'name');

  const [stories, totalItems] = await Promise.all([
    baseQuery.clone().skip(skip).limit(limit),
    baseQuery.clone().countDocuments(),
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
  const { page, perPage, skip } = parsePagination(req.query, {
    page: 1,
    perPage: 6,
  });
  const userId = req.user._id;

  const filter = { savedByUsers: userId };

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
    const avatarUrl = await saveFileToCloudinary(req.file, 'avatars');
    updates.avatar = avatarUrl;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    returnDocument: 'after',
  }).select('-password');

  return res.status(200).json(user);
};
