import Story from '../models/story.js';
import User from '../models/user.js';
import { parsePagination, getPaginationMeta } from '../utils/pagination.js';
import { v2 as cloudinary } from 'cloudinary';
// import bcrypt from 'bcrypt';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getUploadedFile } from '../utils/fileUpload.js';
import createHttpError from 'http-errors';

export const getMyProfile = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

export const getMyStories = async (req, res) => {
  const userId = req.user?._id;

  const { page, perPage, skip } = parsePagination(req.query, {
    page: 1,
    perPage: 6,
  });

  const baseQuery = Story.find({ ownerId: userId })
    .sort({ _id: -1 })
    .populate('category', 'category');

  const [stories, totalItems] = await Promise.all([
    baseQuery.clone().skip(skip).limit(perPage),
    baseQuery.clone().countDocuments(),
  ]);

  const { totalPages, hasNextPage, hasPreviousPage } = getPaginationMeta(
    totalItems,
    page,
    perPage,
  );

  const response = {
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    stories,
  };

  res.status(200).json(response);
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
    .populate('ownerId', 'name avatarUrl')
    .populate('category', 'category');

  const [stories, totalStories] = await Promise.all([
    baseQuery.clone().skip(skip).limit(perPage),
    baseQuery.clone().countDocuments(),
  ]);

  const { totalPages, hasNextPage, hasPreviousPage } = getPaginationMeta(
    totalStories,
    page,
    perPage,
  );

  const response = {
    page,
    perPage,
    totalItems: totalStories,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    stories,
  };

  res.status(200).json(response);
};
// ============================================

export const updateAvatar = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  const uploadedFile = getUploadedFile(req);

  const buffer = Buffer.isBuffer(uploadedFile.buffer)
    ? uploadedFile.buffer
    : Buffer.from(uploadedFile.buffer);

  if (user.avatarUrl && user.avatarUrl.includes('cloudinary')) {
    const publicId = user.avatarUrl
      .split('/')
      .slice(-2)
      .join('/')
      .split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  }

  const result = await saveFileToCloudinary({ buffer }, 'avatars');

  if (!result) {
    throw createHttpError(500, 'Image upload failed');
  }

  user.avatarUrl = result;
  await user.save();

  res.status(200).json({
    avatarUrl: result,
  });
};
// export const updateProfile = async (req, res, next) => {
//   const updates = {};

//   if (req.body.name) {
//     updates.name = req.body.name;
//   }

//   if (req.body.password) {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     updates.password = hashedPassword;
//   }

//   if (req.file) {
//     const avatarUrl = await saveFileToCloudinary(req.file, 'avatars');
//     updates.avatar = avatarUrl;
//   }

//   const user = await User.findByIdAndUpdate(req.user._id, updates, {
//     returnDocument: 'after',
//   }).select('-password');

//   return res.status(200).json(user);
// };
