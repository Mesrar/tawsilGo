import { z } from "zod";




export const resetPasswordFormSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

export const resetEmailFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ResetEmailPasswordFormData = z.infer<typeof resetEmailFormSchema>;

export const forgotPaaswordFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});


export type forgotPaaswordFormData = z.infer<typeof forgotPaaswordFormSchema>;

export const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least one number" },
  { regex: /[a-z]/, text: "At least one lowercase letter" },
  { regex: /[A-Z]/, text: "At least one uppercase letter" },
  { regex: /[^A-Za-z0-9]/, text: "At least one special character" },
];

export const SignInformSchema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  keepSignedIn: z.boolean().default(false),
})

export type SignInFormData = z.infer<typeof SignInformSchema>


// Minimal signup schema - only immediate access fields (Phase 2: Progressive Profiling)
export const minimalSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type MinimalSignupData = z.infer<typeof minimalSignupSchema>;

// Simplified registration schema - essential fields only (LEGACY - kept for backward compatibility)
export const essentialSignupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Invalid phone number")
    .nonempty("Phone number is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  accountType: z.enum(["personal", "business"]).default("personal"),
  // Business-specific fields (conditional)
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  // GDPR compliance
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type EssentialSignupData = z.infer<typeof essentialSignupSchema>;

// Legacy full registration schema (kept for backward compatibility)
export const registrationFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string().min(6, "Username must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Invalid phone number.")
    .nonempty("Phone number is required."),
  address: z.string().min(6, "Address must be at least 6 characters"),
});

export const verificationAccountSchema = z.object({
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
});

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;