import express from 'express';
import cors from 'cors';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import apiRouter from './routes';
import { config } from './config/env';

export function createApp() {
  const app = express();

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-demo-role'],
  }));

  app.use(express.json());
  app.use(requestIdMiddleware);

  // Mount API
  app.use('/api', apiRouter);

  // Error handling middleware
  app.use(errorMiddleware);

  return app;
}
