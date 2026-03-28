import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    versionKey: false,
  },
);

const Category = model('category', categorySchema);
export default Category;
