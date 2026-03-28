import { Joi } from 'celebrate';

export const getStoryByIdSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};
