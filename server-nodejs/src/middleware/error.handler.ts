import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/http';

/** Centralized error handler for REST (and GraphQL expressMiddleware) */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Zod validation
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: err.issues.map((i) => ({ path: i.path, message: i.message })),
    });
  }

  // Errors we actively throw
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: err.code ?? 'ApiError',
      message: err.message,
      details: err.details,
    });
  }

  // JWT / Prisma (add more if needed)
  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    return res.status(401).json({ error: err.name, message: err.message });
  }
  // Example Prisma (Mongo)
  if (err?.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    return res
      .status(400)
      .json({ error: 'PrismaError', code: err.code, message: err.message });
  }

  // Fallback
  console.error(err);
  return res
    .status(500)
    .json({ error: 'InternalServerError', message: 'Something went wrong' });
};
