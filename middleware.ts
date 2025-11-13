import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';

// Public API endpoints that don't require authentication
const publicApiRoutes = [
  "/api/user/reset/password",
  "/api/user/reset/password/confirm",
  "/api/user/available/trips",
  "/api/organizations/register",
  "/api/organizations/verify-invitation",
  // Add other public routes here
];

// Create i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // Always add locale prefix to URL for all languages
});

export async function middleware(request: NextRequest) {
  // Handle i18n routing first
  const response = intlMiddleware(request);

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  const { pathname } = request.nextUrl;

  // Strip locale from pathname for auth checks
  const pathnameWithoutLocale = pathname.replace(/^\/(en|fr|ar)/, '') || '/';

  // Debug logging for driver routes
  if (pathnameWithoutLocale.startsWith("/drivers")) {
    console.log("=== Middleware Debug ===");
    console.log("Path:", pathnameWithoutLocale);
    console.log("Has session:", !!session);
    console.log("User role:", session?.role);
    console.log("=== End Middleware Debug ===");
  }

  // Check if the current route is a public API endpoint
  if (publicApiRoutes.some(route => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}?`))) {
    return response;
  }

  // Handle protected frontend routes
  if (pathnameWithoutLocale.startsWith("/users")) {
    console.log("=== User Route Debug ===");
    console.log("Path:", pathnameWithoutLocale);
    console.log("Has session:", !!session);
    console.log("Session role:", session?.role);
    console.log("Session object:", JSON.stringify(session, null, 2));
    console.log("=== End User Route Debug ===");

    // Case-insensitive role check
    const userRole = session?.role?.toLowerCase();
    if (!session || userRole !== "customer") {
      console.log("❌ Redirecting to signin - No session or not a customer");
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathnameWithoutLocale);
      return NextResponse.redirect(signInUrl);
    }
    console.log("✅ User authenticated as customer, allowing access");
  } else if (pathnameWithoutLocale.startsWith("/organizations")) {
    // Allow public access to organization registration
    if (pathnameWithoutLocale === "/organizations/register") {
      return response;
    }

    // Allow organization verification and invitation pages
    if (pathnameWithoutLocale === "/organizations/verification-pending" ||
        pathnameWithoutLocale === "/organizations/verify-invitation") {
      if (!session) {
        const signInUrl = new URL("/auth/signin", request.url);
        signInUrl.searchParams.set("callbackUrl", pathnameWithoutLocale);
        return NextResponse.redirect(signInUrl);
      }
      return response;
    }

    // Redirect old dashboard route to profile page
    if (pathnameWithoutLocale === "/organizations/dashboard") {
      const profileUrl = new URL("/organizations/profile", request.url);
      return NextResponse.redirect(profileUrl);
    }

    // Other organization routes require organization roles
    const userRole = session?.role?.toLowerCase();
    if (!session || !["organization", "organization_admin", "organization_driver"].includes(userRole)) {
      console.log("❌ Redirecting to signin - No session or not organization member");
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathnameWithoutLocale);
      return NextResponse.redirect(signInUrl);
    }
    console.log("✅ User authenticated as organization member, allowing access");
  } else if (pathnameWithoutLocale.startsWith("/drivers")) {
    // Allow public access to driver landing page
    if (pathnameWithoutLocale === "/drivers/join") {
      return response;
    }

    // Allow driver registration and status pages for authenticated users
    if (pathnameWithoutLocale === "/drivers/register" || pathnameWithoutLocale === "/drivers/status") {
      if (!session) {
        // Redirect to signin with callback URL to return here after login
        const signInUrl = new URL("/auth/signin", request.url);
        signInUrl.searchParams.set("callbackUrl", pathnameWithoutLocale);
        return NextResponse.redirect(signInUrl);
      }
      // Allow any authenticated user to access registration
      return response;
    }

    // Other driver routes require driver role
    // Check for both "driver" and "Driver" (case insensitive)
    const userRole = session?.role?.toLowerCase();
    if (!session || userRole !== "driver") {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathnameWithoutLocale);
      return NextResponse.redirect(signInUrl);
    }
  }

  // For API routes
  if (pathnameWithoutLocale.startsWith("/api/user") && session?.role !== "customer") {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized: Customers only" }),
      { status: 403 }
    );
  }

  if (pathnameWithoutLocale.startsWith("/api/driver/[id]") && session?.role !== "driver") {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized: Drivers only" }),
      { status: 403 }
    );
  }

  // Organization API routes protection
  if (pathnameWithoutLocale.startsWith("/api/organizations")) {
    // Public endpoints (already handled in publicApiRoutes, but adding explicit check)
    const publicOrgRoutes = [
      "/api/organizations/register",
      "/api/organizations/verify-invitation",
    ];

    if (!publicOrgRoutes.some(route => pathnameWithoutLocale.startsWith(route))) {
      const userRole = session?.role?.toLowerCase();
      if (!session || !["organization", "organization_admin", "organization_driver", "admin"].includes(userRole)) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized: Organization members only" }),
          { status: 403 }
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};