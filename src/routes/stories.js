import { celebrate } from 'celebrate';
import { Router } from 'express';
import getAllStories from '../controllers/storyController.js';
import { getAllStoriesSchema } from '../validations/storyValidation.js';

const storiesRouter = Router();

storiesRouter.get('/stories', celebrate(getAllStoriesSchema), getAllStories);
