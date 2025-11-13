import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiException } from './error-handler';

/**
 * Parses and validates JSON request body using Zod schema
 */
export async function validateRequestBody<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate against the schema
    const result = schema.safeParse(body);
    
    if (!result.success) {
      throw ApiException.validationError(
        'Invalid request data',
        formatZodErrors(result.error)
      );
    }
    
    return result.data;
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      throw ApiException.badRequest('Invalid JSON in request body');
    }
    
    // Re-throw ApiExceptions
    if (error instanceof ApiException) {
      throw error;
    }
    
    // Handle unexpected errors
    throw ApiException.internal('Error processing request data', {
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Validates URL search params using Zod schema
 */
export function validateQueryParams<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): z.infer<T> {
  // Get search params as object
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  
  // Validate against the schema
  const result = schema.safeParse(searchParams);
  
  if (!result.success) {
    throw ApiException.validationError(
      'Invalid query parameters',
      formatZodErrors(result.error)
    );
  }
  
  return result.data;
}

/**
 * Helper function to format Zod errors into a more user-friendly structure
 */
function formatZodErrors(errors: z.ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};
  
  for (const issue of errors.errors) {
    const path = issue.path.join('.');
    
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    
    formattedErrors[path].push(issue.message);
  }
  
  return formattedErrors;
}