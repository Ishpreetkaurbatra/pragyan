import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const requestId = res.locals.requestId || 'unknown';
  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected server error occurred.';

  // Structured logging
  console.error(`[Error] [Req: ${requestId}] ${errorCode}: ${message}`, err.stack ? err.stack.split('\n')[1] : '');

  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      requestId,
    },
  });
}
