import { Joi, Segments } from 'celebrate';

export const updateProfileSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32),
    password: Joi.string().min(8).max(128),
  }),
};
