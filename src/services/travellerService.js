import User from '../models/user.js';
import Story from '../models/story.js';

export const getTravellerProfile = async (userId) => {
  return await User.findById(userId).select('-email');
};

export const getTravellerStories = async ({ ownerId, page, limit }) => {
  const skip = (page - 1) * limit;

  const storiesQuery = Story.find({ ownerId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('category', 'name');

  const [stories, totalItems] = await Promise.all([
    storiesQuery,
    Story.countDocuments({ownerId }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    stories,
    totalItems,
    totalPages,
    currentPage: page,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
};
