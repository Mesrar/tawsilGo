import { NextAuthOptions, Session, User, Account, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

// Define proper types for auth-related data
interface AuthToken {
  id: string;
  name: string;
  role: string;
  email?: string;
  token: string;
}

interface TokenPayload {
  sub: string;
  name: string;
  role: string;
  email?: string;
  exp?: number; // Expiration timestamp
  iat?: number; // Issued at timestamp
  [key: string]: any;
}

// API error handling
class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

// Validate token format
const isValidTokenFormat = (token: string): boolean => {
  return Boolean(token && token.split(".").length === 3);
};

// Get token expiration time
const getTokenExpiration = (token: string): number | null => {
  try {
    if (!isValidTokenFormat(token)) return null;

    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.exp || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return false;

  // Add 10 second buffer to account for clock skew
  return (expiration * 1000) < (Date.now() - 10000);
};

// Validate API URL
const getValidatedApiUrl = (): string => {
  const apiUrl = process.env.VERIFY_API_URL;
  if (!apiUrl) {
    throw new Error("VERIFY_API_URL environment variable is not configured");
  }
  return apiUrl;
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        token: { label: "Token", type: "text" }
      },
      async authorize(credentials) {
        try {
          // Basic validation
          if (!credentials?.token) {
            console.error("No token provided to NextAuth");
            return null;
          }

          // Check for token expiration before making API call
          if (isTokenExpired(credentials.token)) {
            console.error("Token is expired, rejecting without API call");
            return null;
          }

          // Log token format for debugging (truncated for security)
          const tokenPreview = credentials.token.substring(0, 10) + "...";
          console.log(`Processing token: ${tokenPreview}`);

          // Validate token with backend
          const verifyApiUrl = getValidatedApiUrl();

          // Add request timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const res = await fetch(`${verifyApiUrl}/validate-token`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${credentials.token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          // Log response status for debugging
          console.log(`Token validation HTTP status: ${res.status}`);

          if (!res.ok) {
            const errorText = await res.text();
            console.error(`Token validation failed: ${errorText || res.statusText}`);
            return null;
          }

          const response = await res.json();
          console.log("Token validated successfully");

          // Extract token expiration if available
          const expiration = getTokenExpiration(credentials.token);

          return {
            id: response.claims.sub,
            name: response.claims.name,
            role: response.claims.role,
            email: response.claims.email,
            token: credentials.token,
            exp: expiration
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Sign-in page fallback
      if (url === `${baseUrl}/auth/signin`) {
        return baseUrl;
      }

      // Valid internal URL
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default fallback
      return baseUrl;
    },

    async jwt({ token, user, account }) {
      // Initial sign in - user information is available
      if (user) {
        // Type safe assignment
        const authUser = user as AuthToken & { exp?: number };
        token.id = authUser.id;
        token.role = authUser.role;
        token.accessToken = authUser.token;
        token.exp = authUser.exp; // Save expiration time
        token.tokenIssueTime = Date.now(); // Track when we received this token
      }

      // For existing tokens, check expiration
      if (token.accessToken) {
        // Check expiration - either from stored exp or by decoding token
        const tokenExp = token.exp || getTokenExpiration(token.accessToken as string);

        if (tokenExp && typeof tokenExp === 'number') {
          // Update token exp if it wasn't stored before
          if (!token.exp) {
            token.exp = tokenExp;
          }

          // Check if token is expired
          const now = Math.floor(Date.now() / 1000);
          const isExpired = tokenExp < now;

          if (isExpired) {
            console.log("Token is expired in JWT callback");
            // Mark token as expired
            token.expired = true;
          }
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Type-safe session enhancement
      const enhancedSession = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        },
        accessToken: token.accessToken as string,
        expires: session.expires,
        tokenExpires: token.exp as number | undefined,
        error: token.expired ? "TokenExpired" : undefined
      };

      return enhancedSession;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  logger: {
    error(code, metadata) {
      console.error(`[Auth Error] ${code}:`, metadata);
    },
    warn(code) {
      console.warn(`[Auth Warning] ${code}`);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV !== "production") {
        console.debug(`[Auth Debug] ${code}:`, metadata);
      }
    },
  },
};
