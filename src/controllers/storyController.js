import createHttpError from 'http-errors';
import Story from '../models/story.js';

export const getStoryById = async (req, res) => {
  const { id } = req.params;

  const story = await Story.findById(id)
    .populate('ownerId', 'name avatar')
    .populate('category', 'name');

  if (!story) {
    throw createHttpError(404, 'Така історія відсутня');
  }

  res.status(200).json({
    status: 200,
    data: story,
  });
};
