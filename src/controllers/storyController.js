import Story from '../models/story.js';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const createStory = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    const result = await saveFileToCloudinary(req.file.buffer, req.user._id);

    const story = await Story.create({
      ...req.body,
      image: result.secure_url,
      author: req.user._id,
    });

    res.status(201).json(story);
  } catch (error) {
    next(error);
  }
};
