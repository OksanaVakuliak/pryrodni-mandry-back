import { Joi, Segments } from 'celebrate';
import { isValidJoi } from '../middleware/isValidId.js';

export const paginationFields = {
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least {#limit}',
  }),
  perPage: Joi.number().integer().min(1).max(100).default(6).messages({
    'number.base': 'perPage must be a number',
    'number.integer': 'perPage must be an integer',
    'number.min': 'perPage must be at least {#limit}',
    'number.max': 'perPage must be at most {#limit}',
  }),
};

export const paginationQuerySchema = {
  [Segments.QUERY]: Joi.object({
    ...paginationFields,
  }),
};

export const validIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(isValidJoi).required().messages({
      'string.base': 'ID must be a string',
      'string.empty': 'ID is required',
      'any.required': 'ID is required',
    }),
  }),
};
