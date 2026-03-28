import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(createHttpError(404, `ID ${id} is not valid`));
  }
  next();
};

export const isValidJoi = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('"{{#label}}" must be a valid ObjectId');
  }
  return value;
};
