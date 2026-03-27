import Story from '../models/story.js';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const createStory = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    const buffer = Buffer.isBuffer(req.file.buffer)
      ? req.file.buffer
      : Buffer.from(req.file.buffer);

    const result = await saveFileToCloudinary({ buffer }, req.user._id);

    if (!result) {
      throw createHttpError(500, 'Image upload failed');
    }

    const story = await Story.create({
      ...req.body,
      image: result,
      author: req.user._id,
    });

    res.status(201).json(story);
  } catch (error) {
    next(error);
  }
};
