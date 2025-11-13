// lib/api-utils.ts
import { handleApiError } from "./error-handlers";

interface ApiOptions extends RequestInit {
  saveState?: () => void;
  onUnauthorized?: () => void;
}

/**
 * Makes an API request with consistent error handling for authentication issues
 * Will automatically show login modal on 401 or 403 responses
 */
export async function apiRequest<T = any>(
  url: string,
  options?: ApiOptions
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    // Handle authentication errors using our error handler
    if (response.status === 401 || response.status === 403) {
      await handleApiError(response, {
        saveState: options?.saveState,
        onUnauthorized: options?.onUnauthorized,
      });
      // We throw an error to prevent continuing with the response processing
      throw new Error(response.status === 401 ? "Authentication required" : "Access denied");
    }

    // Handle other error statuses
    if (!response.ok) {
      await handleApiError(response);
      throw new Error(`API error: ${response.status}`);
    }

    // Parse and return the JSON response
    return await response.json() as T;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}