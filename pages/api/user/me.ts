import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { 
  handleApiError, 
  successResponse, 
  validateHttpMethod, 
  withErrorHandling 
} from '@/lib/api/responses';
import { UserService } from '@/lib/api/user-service';
import { AuthenticationError } from '@/lib/api/errors';

// Define proper types for better documentation and type safety
interface UserData {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

async function profileHandler(
  req: NextApiRequest, 
  res: NextApiResponse<ApiResponse<UserData>>
) {
  // Validate HTTP method
  if (!validateHttpMethod(req, res, ['GET'])) {
    return;
  }

  // Get token from cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'You must be logged in to access this resource',
      status: 401
    });
  }

  try {
    // Use the UserService to handle API requests
    const userService = new UserService();
    const userData = await userService.getProfile(token);
    
    return successResponse(res, userData);
  } catch (error) {
    // Let our error handler take care of it
    handleApiError(res, error);
  }
}

// Export the handler with error handling middleware only
export default withErrorHandling(profileHandler);