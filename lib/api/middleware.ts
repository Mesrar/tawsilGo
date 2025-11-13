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
 */
export function cors(options: CorsOptions = {}) {
  const corsMiddleware = Cors({
    methods: options.methods || ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: options.origin || process.env.ALLOWED_ORIGINS?.split(',') || false,
    credentials: options.credentials || true,
    maxAge: options.maxAge || 86400, // 24 hours
  });

  return (handler: NextApiHandler): NextApiHandler => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      // Add security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      return new Promise((resolve, reject) => {
        corsMiddleware(req, res, (result: any) => {
          if (result instanceof Error) {
            return reject(result);
          }
          
          return resolve(handler(req, res));
        });
      });
    };
  };
}