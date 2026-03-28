import { Joi, Segments } from 'celebrate';

export const getTravellersSchema = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least {#limit}',
    }),
    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least {#limit}',
      'number.max': 'Limit must be at most {#limit}',
    }),
  }),
};
