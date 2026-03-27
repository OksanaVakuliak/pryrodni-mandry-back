import { Joi, Segments } from 'celebrate';

export const getAllStoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(6),
    category: Joi.string().hex().length(24),
  }),
};
