import { withApiErrorHandling } from "@/lib/api/error-handling";
import { cors } from "@/lib/api/middleware";
import { sanitizeRequest } from "@/lib/api/sanitize";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";


// Define strong types for the request payload
export const UserRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string().min(6, "Username must have at least 6 characters").optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().optional(),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Please enter a valid phone number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  acceptTerms: z.boolean(),
  // V2 API - Business account support
  accountType: z.enum(["personal", "business"]).default("personal"),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
}).refine((data) => {
  // If accountType is business, companyName is required
  if (data.accountType === "business" && !data.companyName) {
    return false;
  }
  return true;
}, {
  message: "Company name is required for business accounts",
  path: ["companyName"],
});

// Type inference from schema
export type UserRegistrationRequest = z.infer<typeof UserRegistrationSchema>;

// RFC 7807 Problem Details format
interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

// Response type for success
interface RegistrationResponse {
  success: boolean;
  data: {
    id: string;
    token?: string;
  };
}

// Handler with proper error handling
async function registerHandler(
  req: NextApiRequest, 
  res: NextApiResponse<RegistrationResponse | ProblemDetails>
) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({
      type: "https://example.com/errors/method-not-allowed",
      title: "Method Not Allowed",
      status: 405,
      detail: "This endpoint only supports POST requests"
    });
  }

  try {
    // 2. Validate request body with Zod
    const validationResult = UserRegistrationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const formattedErrors: Record<string, string[]> = {};
      
      // Format validation errors for client consumption
      validationResult.error.errors.forEach(error => {
        const path = error.path.join('.');
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(error.message);
      });
      
      return res.status(400).json({
        type: "https://example.com/errors/validation-error",
        title: "Validation Error",
        status: 400,
        detail: "The request payload contains validation errors",
        errors: formattedErrors
      });
    }
    
    const userData = validationResult.data;
    
    // 3. Send validated data to external API
    const verifyApiUrl = process.env.VERIFY_API_URL;
    if (!verifyApiUrl) {
      throw new Error("VERIFY_API_URL environment variable is not set");
    }
    
    const response = await fetch(`${verifyApiUrl}/api/v2/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': req.headers['x-request-id'] as string || crypto.randomUUID()
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    // 4. Handle API response with proper status code mapping
    if (!response.ok) {
      // Map specific error cases
      switch (response.status) {
        case 409:
          return res.status(409).json({
            type: "https://example.com/errors/conflict",
            title: "Resource Conflict",
            status: 409,
            detail: data.details || "User with this email or username already exists",
            instance: req.url
          });
        case 422:
          return res.status(422).json({
            type: "https://example.com/errors/unprocessable-entity",
            title: "Unprocessable Entity",
            status: 422,
            detail: data.details || "The server understood the request, but cannot process it",
            instance: req.url
          });
        default:
          return res.status(response.status).json({
            type: "https://example.com/errors/api-error",
            title: "Registration Failed",
            status: response.status,
            detail: data.details || "An error occurred during registration",
            instance: req.url
          });
      }
    }

    // 5. Success response
    return res.status(201).json({
      success: true,
      data: {
        id: data.id,
        token: data.token // Include auth token if provided by the API
      }
    });

  } catch (error) {
    console.error('[REGISTER_API_ERROR]', error);
    
    // Differentiate between network errors and other exceptions
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return res.status(503).json({
        type: "https://example.com/errors/service-unavailable",
        title: "Service Unavailable",
        status: 503,
        detail: "Unable to reach the authentication service",
        instance: req.url
      });
    }
    
    return res.status(500).json({
      type: "https://example.com/errors/internal-server-error",
      title: "Internal Server Error",
      status: 500,
      detail: "An unexpected error occurred",
      instance: req.url
    });
  }
}

// Create middleware chain with CORS and error handling
export default cors({
  methods: ['POST', 'OPTIONS'],
  maxAge: 86400, // 24 hours
})(
  sanitizeRequest(
    withApiErrorHandling(registerHandler)
  )
);