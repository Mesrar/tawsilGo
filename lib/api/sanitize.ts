import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes request bodies to prevent XSS attacks
 */
export function sanitizeRequest(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.body && typeof req.body === 'object') {
      const sanitizedBody = sanitizeObject(req.body);
      req.body = sanitizedBody;
    }
    return handler(req, res);
  };
}

/**
 * Recursively sanitizes all string values in an object
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return DOMPurify.sanitize(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitizeObject(value)])
    );
  }
  
  return obj;
}