import { isValidObjectId } from 'mongoose';

export const isValidJoi = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('"{{#label}}" must be a valid ObjectId');
  }
  return value;
};
