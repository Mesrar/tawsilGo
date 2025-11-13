import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Wraps API handlers with standardized error handling
 */
export function withApiErrorHandling(
  handler: NextApiHandler
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error: unknown) {
      console.error('[API_ERROR]', {
        url: req.url,
        method: req.method,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      const apiError = error as ApiError;
      const statusCode = apiError.statusCode || 500;
      
      // Don't send error details in production
      const detail = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An unexpected error occurred'
        : apiError.message || 'An unexpected error occurred';
      
      // Only send response if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(statusCode).json({
          type: `https://example.com/errors/${statusCode === 500 ? 'internal-server-error' : 'api-error'}`,
          title: statusCode === 500 ? 'Internal Server Error' : 'API Error',
          status: statusCode,
          detail,
          code: apiError.code,
          instance: req.url,
        });
      }
    }
  };
}