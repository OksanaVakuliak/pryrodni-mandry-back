import { Joi, Segments } from 'celebrate';

export const createCategorySchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().required(),
  }),
};
