import express from 'express';
import cors from 'cors';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import apiRouter from './routes';
import { config } from './config/env';

export function createApp() {
  const app = express();

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    ...(config.webOrigin ? config.webOrigin.split(',').map(s => s.trim()) : []),
  ];

  app.use(cors({
    origin: (requestOrigin, callback) => {
      // Allow requests with no origin (curl, server-to-server, mobile)
      if (!requestOrigin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(requestOrigin) ||
        /\.vercel\.app$/.test(requestOrigin) ||
        config.env === 'development';

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${requestOrigin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-demo-role'],
  }));

  app.use(express.json());
  // Service liveness health check
  app.get('/health', (_req, res) => {
    return res.json({
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      service: 'tg-backend',
      version: '1.0.0',
    });
  });

  // Mount API
  app.use('/api', apiRouter);

  // 404 handler for unmatched API routes
  app.use('/api', (req, res) => {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.method} ${req.originalUrl} not found`,
        requestId: res.locals.requestId || 'unknown',
      },
    });
  });

  // Error handling middleware
  app.use(errorMiddleware);

  return app;
}
