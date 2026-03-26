import { celebrate } from 'celebrate';
import { Router } from 'express';
import getAllStories from '../controllers/storyController';

const storiesRouter = Router();

storiesRouter.get('/stories', celebrate(getAllStoriesSchema), getAllStories);
