import { Joi, Segments } from 'celebrate';
import { isValidJoi } from '../middleware/isValidId.js';

export const getAllStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    category: Joi.string().custom(isValidJoi).messages({
      'string.hex': 'Category must be a valid hex string',
    }),
  }),
};

export const createStorySchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least {#limit} character',
      'any.required': 'Title is required',
    }),
    article: Joi.string().min(1).required().messages({
      'string.base': 'Article must be a string',
      'string.empty': 'Article is required',
      'string.min': 'Article must be at least {#limit} character',
      'any.required': 'Article is required',
    }),
    category: Joi.string().custom(isValidJoi).required().messages({
      'any.required': 'Category is required',
    }),
  }),
};
