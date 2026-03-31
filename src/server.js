import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';

import { connectMongoDB } from './db/connectMongoDB.js';

import travellersRouter from './routes/travellers.js';
import categoriesRoutes from './routes/categories.js';
import storiesRouter from './routes/stories.js';
import profileRoutes from './routes/profile.js';
import authRoutes from './routes/auth.js';
import docsRouter from './routes/docs.js';

const PORT = Number(process.env.PORT) || 4000;

const app = express();

app.use(logger);
app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/docs', docsRouter);
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRouter);
app.use('/api/travellers', travellersRouter);
app.use('/api/categories', categoriesRoutes);
app.use('/api/profile', profileRoutes);

app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
