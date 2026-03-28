import createHttpError from 'http-errors';
import User from '../models/user.js';
import Story from '../models/story.js';

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
