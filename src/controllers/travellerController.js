import User from '../models/user.js';
import Story from '../models/story.js';
import createHttpError from 'http-errors';
import { parsePagination, getPaginationMeta } from '../utils/pagination.js';

export const getTravellers = async (req, res) => {
  const { page, perPage, skip } = parsePagination(req.query, {
    page: 1,
    perPage: 10,
  });

  const queryFilter = { articlesAmount: { $gt: 0 } };

  const travellersQuery = User.find(queryFilter)
    .select('-password -email -updatedAt -createdAt -__v')
    .sort({ articlesAmount: -1 });

  const [users, totalItems] = await Promise.all([
    travellersQuery.clone().skip(skip).limit(perPage),
    travellersQuery.clone().countDocuments(),
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
    users,
  };

  res.status(200).json(response);
};

export const getTravellerProfile = async (req, res, next) => {
  const { id } = req.params;
  const traveller = await User.findById(id).select('-email');
  if (!traveller) {
    throw createHttpError(404, 'Traveller not found');
  }

  res.status(200).json(traveller);
};

export const getTravellerStories = async (req, res, next) => {
  const { id } = req.params;
  const { page, perPage, skip } = parsePagination(req.query, {
    page: 1,
    perPage: 6,
  });

  const storiesQuery = Story.find({ ownerId: id })
    .sort({ _id: -1 })
    .populate('category', 'category');

  const [stories, totalItems] = await Promise.all([
    storiesQuery.clone().skip(skip).limit(perPage),
    storiesQuery.clone().countDocuments(),
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
