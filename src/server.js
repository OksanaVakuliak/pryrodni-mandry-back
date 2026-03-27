import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import travellersRouter from './routes/travellers.js';
import categoriesRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';
import { errors } from 'celebrate';

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

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Pryrodni Mandry API',
  });
});

app.use(authRoutes);
app.use(travellersRouter);
app.use(categoriesRoutes);
app.use(storiesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
