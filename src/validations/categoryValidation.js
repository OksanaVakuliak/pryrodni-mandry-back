import { Joi, Segments } from 'celebrate';

export const createCategorySchema = {
  [Segments.BODY]: Joi.object({
    category: Joi.string().trim().required(),
  }),
};
