import User from '../models/user.js';
import Story from '../models/story.js';
import createHttpError from 'http-errors';
import parsePagination from '../utils/pagination.js';

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
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    data: {
      users,
      page,
      perPage,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
};

export const getTravellerProfile = async (req, res, next) => {
  const { id } = req.params;
  const traveller = await User.findById(id).select('-email');
  if (!traveller) {
    throw createHttpError(404, 'Traveller not found');
  }

  res.status(200).json({
    data: traveller,
  });
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

  const totalPages = Math.ceil(totalItems / perPage);

  const result = {
    stories,
    totalItems,
    totalPages,
    currentPage: page,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };

  res.status(200).json({
    data: result,
  });
};
