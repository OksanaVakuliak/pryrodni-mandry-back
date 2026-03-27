<<<<<<< HEAD
import { celebrate } from 'celebrate';
import { Router } from 'express';
import getAllStories from '../controllers/storyController.js';
import { getAllStoriesSchema } from '../validations/storyValidation.js';

const storiesRouter = Router();

storiesRouter.get('/', celebrate(getAllStoriesSchema), getAllStories);

export default storiesRouter;
=======
>>>>>>> b0ad85161e7762ac11bef9f137b8c098d513105b
