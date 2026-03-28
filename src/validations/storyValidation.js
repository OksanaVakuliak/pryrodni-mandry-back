import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const createStorySchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    article: Joi.string().min(1).required(),
    img: Joi.string(),
    category: Joi.string().hex().length(24).required(),
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
    id: Joi.string().custom(objectIdValidator).required(),
  }),
};
