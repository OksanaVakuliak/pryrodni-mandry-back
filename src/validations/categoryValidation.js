import { Joi, Segments } from 'celebrate';

export const createCategorySchema = {
  [Segments.BODY]: Joi.object({
    category: Joi.string().trim().required().messages({
      'string.base': 'Category must be a string',
      'string.empty': 'Category is required',
      'any.required': 'Category is required',
    }),
  }),
};
