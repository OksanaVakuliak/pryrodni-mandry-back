import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

import Story from '../models/story.js';
import User from '../models/user.js';
import { parsePagination, getPaginationMeta } from '../utils/pagination.js';
import { v2 as cloudinary } from 'cloudinary';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getUploadedFile } from '../utils/fileUpload.js';
import createHttpError from 'http-errors';
import { UpdateRequest } from '../models/updateRequests.js';
import { sendEmail } from '../utils/sendMail.js';

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

export const requestProfileUpdate = async (req, res) => {
  const { name, password } = req.body;
  const user = req.user;

  const pendingUpdates = {};
  if (name) pendingUpdates.name = name;
  if (password) {
    pendingUpdates.password = await bcrypt.hash(password, 10);
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await UpdateRequest.deleteMany({ userId: user._id });

  await UpdateRequest.create({
    userId: user._id,
    pendingUpdates,
    token,
    expiresAt,
  });

  const templatePath = path.resolve('src', 'templates', 'confirm-update.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);

  const html = template({
    userName: user.name,
    confirmLink: `${process.env.FRONTEND_URL}/profile/confirm/${token}`,
  });

  await sendEmail({
    to: user.email,
    subject: 'Confirm your profile update',
    html,
  });

  res.status(200).json({
    message: 'Confirmation email sent successfully',
  });
};
