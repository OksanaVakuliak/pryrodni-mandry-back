import Story from '../models/story.js';
import createHttpError from 'http-errors';

export const saveStoryForUser = async (storyId, userId) => {
  const story = await Story.findById(storyId);
  if (!story) throw createHttpError(404, 'Story not found');

  const alreadySaved = story.savedByUsers.some((uid) => uid.equals(userId));
  if (alreadySaved) return story;

  const updated = await Story.findByIdAndUpdate(
    storyId,
    { $addToSet: { savedByUsers: userId }, $inc: { rate: 1 } },
    { returnDocument: 'after' },
  );

  return updated;
};

export const unsaveStoryForUser = async (storyId, userId) => {
  const story = await Story.findById(storyId);
  if (!story) throw createHttpError(404, 'Story not found');

  const isSaved = story.savedByUsers.some((uid) => uid.equals(userId));
  if (!isSaved) return story;

  const updated = await Story.findByIdAndUpdate(
    storyId,
    { $pull: { savedByUsers: userId }, $inc: { rate: -1 } },
    { returnDocument: 'after' },
  );

  return updated;
};

export default {
  saveStoryForUser,
  unsaveStoryForUser,
};
