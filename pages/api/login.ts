import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { jwtDecode } from "jwt-decode";
import { z } from 'zod';

// Define TypeScript types for API responses
type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  details?: unknown;
  user?: T;
};

// Define a type for the decoded JWT token
// Support both standard JWT claims and custom backend claims
type DecodedToken = {
  id?: string;           // Standard claim
  userId?: string;       // Custom backend claim
  sub?: string;          // Standard JWT subject claim
  name?: string;         // Standard claim
  username?: string;     // Custom backend claim
  role: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
};

// User data returned to client
type UserResponse = {
  id: string;
  name: string;
  role: string;
  token: string;
};

// Define custom error class for authentication errors
class AuthError extends Error {
  statusCode: number;
  details?: unknown;
  
  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Define validation schema for login request with better error messages
const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .max(100, 'Username is too long'),
  password: z.string()
    .min(1, 'Password is required')
    .max(100, 'Password is too long'),
  keepSignedIn: z.boolean().optional()
});

type LoginData = z.infer<typeof loginSchema>;

// Validate environment configuration
const getValidatedApiUrl = (): string => {
  const apiUrl = process.env.VERIFY_API_URL;
  if (!apiUrl) {
    throw new AuthError(
      'Server configuration error: Missing authentication service URL',
      500
    );
  }
  return apiUrl;
};

// Perform actual authentication with the backend service
async function authenticateUser(username: string, password: string): Promise<{token: string}> {
  const apiUrl = getValidatedApiUrl();
  
  // Setup request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Handle non-success responses
    if (!response.ok) {
      let errorData = null;
      
      try {
        errorData = await response.json();
      } catch (e) {
        // If parsing JSON fails, try to get text content
        const textContent = await response.text().catch(() => '');
        errorData = textContent || 'No error details available';
      }
      
      // Map status codes to appropriate errors
      switch (response.status) {
        case 400:
          throw new AuthError('Invalid login request', 400, errorData);
        case 401:
          throw new AuthError('Invalid username or password', 401, errorData);
        case 403:
          throw new AuthError('Your account is locked or disabled', 403, errorData);
        case 429:
          throw new AuthError('Too many login attempts. Please try again later.', 429);
        default:
          throw new AuthError(
            errorData?.message || errorData?.error || 'Authentication service error',
            response.status,
            errorData
          );
      }
    }
    
    const data = await response.json();
    
    if (!data.token) {
      throw new AuthError('Invalid authentication response: Missing token', 500);
    }
    
    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    
    if (error instanceof Error) {
      // Handle fetch-specific errors
      if (error.name === 'AbortError') {
        throw new AuthError(
          'Authentication request timed out. The service is taking too long to respond.',
          503
        );
      }
      
      // Handle other network errors
      throw new AuthError(
        'Unable to connect to the authentication service.',
        503,
        { originalError: error.message }
      );
    }
    
    // Fallback for unknown errors
    throw new AuthError('Unknown authentication error occurred', 500);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserResponse>>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed',
      message: `Method ${req.method} is not allowed. Only POST requests are supported.`
    });
  }
  
  try {
    // Validate request body with Zod
    const validationResult = loginSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'The provided login credentials are invalid',
        details: validationResult.error.format()
      });
    }
    
    const { username, password, keepSignedIn } = validationResult.data;
    
    // Authenticate the user
    const { token } = await authenticateUser(username, password);
    
    try {
      // Decode the JWT to extract user information
      const decoded: DecodedToken = jwtDecode(token);
      
      // Calculate cookie expiration based on keepSignedIn preference
      const cookieMaxAge = keepSignedIn
        ? 60 * 60 * 24 * 7  // 7 days
        : 60 * 60 * 24;     // 1 day
      
      // Set authentication cookie
      res.setHeader(
        'Set-Cookie',
        serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: cookieMaxAge,
          sameSite: 'strict',
          path: '/',
        })
      );
      
      // Return success response with user information (excluding sensitive data)
      // Handle both standard JWT claims (id, sub, name) and custom backend claims (userId, username)
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: decoded.id || decoded.userId || decoded.sub || '',
          name: decoded.name || decoded.username || '',
          role: decoded.role,
          token // Include token for NextAuth.js to use
        }
      });
    } catch (decodeError) {
      console.error('Error decoding JWT token:', decodeError);
      throw new AuthError('Could not process authentication token', 500);
    }
  } catch (error) {
    // Handle known authentication errors
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
        details: error.details
      });
    }
    
    // Log and handle unexpected errors
    console.error('Unhandled error in login API:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred during login',
      details: process.env.NODE_ENV === 'development' 
        ? { message: error instanceof Error ? error.message : String(error) }
        : undefined
    });
  }
}