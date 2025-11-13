import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * POST /api/auth/refresh
 * Refresh the authentication token
 *
 * Note: NextAuth with JWT strategy doesn't require explicit refresh
 * This endpoint validates that the session is still valid
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get current session token
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No valid session found",
      });
    }

    // Check if token is expired
    if (token.exp && typeof token.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      if (token.exp < now) {
        return res.status(401).json({
          success: false,
          error: "Session expired",
        });
      }
    }

    // Session is still valid
    return res.status(200).json({
      success: true,
      message: "Session is valid",
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
