import { Joi, Segments } from 'celebrate';

export const confirmProfileUpdateSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required().messages({
      'string.pattern.base': 'Невірний формат токена',
    }),
  }),
};
