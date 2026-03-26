import { Schema, model } from 'mongoose';

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    savedByUsers: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Story = model('story', storySchema);
export default Story;
