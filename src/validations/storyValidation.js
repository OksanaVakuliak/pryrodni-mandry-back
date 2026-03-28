import { Joi, Segments } from 'celebrate';
import { isValidJoi } from '../middleware/isValidId.js';

export const getStoryByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(isValidJoi).required(),
  }),
};

export const getAllStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(6),
    category: Joi.string().hex().length(24),
  }),
};

export const patchSaveStorySchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(isValidJoi).required(),
  }),
};

export const getSavedStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(6),
  }),
};

export const createStorySchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(1).required(),
    article: Joi.string().min(1).required(),
    category: Joi.string().hex().length(24).required(),
  }),
};
