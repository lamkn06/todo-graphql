import type { Request, Response, NextFunction, RequestHandler } from 'express';

/** Wrap an async Express function to automatically .catch(next) */
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/** Standard ApiError to throw in controller/service */
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(
    status: number,
    message: string,
    opts?: { code?: string; details?: unknown },
  ) {
    super(message);
    this.status = status;
    this.code = opts?.code;
    this.details = opts?.details;
  }
}

/** Helper: throw 401/403/404 quickly */
export const Http = {
  badRequest: (msg = 'Bad Request', details?: unknown) =>
    new ApiError(400, msg, { details }),
  unauthorized: (msg = 'Unauthorized') => new ApiError(401, msg),
  forbidden: (msg = 'Forbidden') => new ApiError(403, msg),
  notFound: (msg = 'Not Found') => new ApiError(404, msg),
  conflict: (msg = 'Conflict') => new ApiError(409, msg),
};
