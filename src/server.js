import categoriesRoutes from './routes/categories.js';

import express from 'express';
const app = express();

app.use('/categories', categoriesRoutes);
