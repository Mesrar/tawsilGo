import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

interface CorsOptions {
  methods?: string[];
  origin?: string | string[] | ((origin: string | undefined) => boolean);
  credentials?: boolean;
  maxAge?: number;
}

/**
 * Initialize CORS middleware with proper security options
 *
 * Environment-aware configuration:
 * - Development: Allows all origins by default for easier local development
 * - Production: Requires explicit ALLOWED_ORIGINS configuration
 */
export function cors(options: CorsOptions = {}) {
  /**
   * Determine allowed origins with smart fallback logic
   */
  const getAllowedOrigins = (): string | string[] | boolean => {
    // If explicitly passed in options, use that
    if (options.origin !== undefined) {
      return options.origin;
    }

    // Check environment variable
    const envOrigins = process.env.ALLOWED_ORIGINS;
    if (envOrigins) {
      const origins = envOrigins.split(',').map(o => o.trim()).filter(Boolean);
      return origins.length > 0 ? origins : false;
    }

    // Default: Allow all origins in development, block in production
    if (process.env.NODE_ENV === 'development') {
      return true; // Allow all origins in development
    }

    // In production without ALLOWED_ORIGINS, log warning and block
    console.warn(
      '[CORS] ALLOWED_ORIGINS environment variable is not set. ' +
      'Cross-origin requests will be blocked. Set ALLOWED_ORIGINS to allow specific domains.'
    );
    return false;
  };

  const corsMiddleware = Cors({
    methods: options.methods || ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: getAllowedOrigins(),
    credentials: options.credentials || true,
    maxAge: options.maxAge || 86400, // 24 hours
  });

  return (handler: NextApiHandler): NextApiHandler => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      // Log incoming CORS requests in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CORS] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'same-origin'}`);
      }

      // Add security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');

      return new Promise((resolve, reject) => {
        corsMiddleware(req, res, (result: Error | unknown) => {
          if (result instanceof Error) {
            console.error('[CORS_ERROR]', {
              url: req.url,
              method: req.method,
              origin: req.headers.origin,
              error: result.message,
              allowedOrigins: process.env.ALLOWED_ORIGINS || 'not configured'
            });
            return reject(result);
          }

          return resolve(handler(req, res));
        });
      });
    };
  };
}