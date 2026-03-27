import { Joi, Segments } from 'celebrate';

export const createStorySchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
    category: Joi.string().hex().length(24).required(),
  }),
};
