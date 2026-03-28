import { Joi, Segments } from 'celebrate';

export const updateProfileSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32).messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least {#limit} characters',
      'string.max': 'Name must be at most {#limit} characters',
    }),
    password: Joi.string().min(8).max(128).messages({
      'string.base': 'Password must be a string',
      'string.min': 'Password must be at least {#limit} characters',
      'string.max': 'Password must be at most {#limit} characters',
    }),
  }),
};
