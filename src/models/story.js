import { Schema, model } from 'mongoose';

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    article: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
    },
    savedByUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const Story = model('story', storySchema);
export default Story;
