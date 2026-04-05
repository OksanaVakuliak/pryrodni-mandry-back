import { Schema, model } from 'mongoose';

const updateRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    pendingUpdates: {
      name: { type: String },
      password: { type: String },
    },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

updateRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const UpdateRequest = model('updateRequests', updateRequestSchema);
