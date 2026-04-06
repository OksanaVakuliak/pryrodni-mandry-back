import { Joi, Segments } from 'celebrate';

export const confirmProfileUpdateSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string()
      .base64({ paddingRequired: false })
      .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Невірний формат токена',
      }),
  }),
};
