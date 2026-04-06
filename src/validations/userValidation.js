import { Joi, Segments } from 'celebrate';

export const confirmProfileUpdateSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required().messages({
      'string.pattern.base': 'Невірний формат токена',
    }),
  }),
};

export const updateProfileRequestSchema = {
  [Segments.BODY]: Joi.object()
    .keys({
      name: Joi.string().min(2).optional(),
      password: Joi.string().min(8).optional(),
    })
    .or('name', 'password')
    .messages({
      'object.missing':
        'At least one field (name or password) must be provided',
    }),
};
