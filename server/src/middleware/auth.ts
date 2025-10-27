import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader, JWTPayload } from "../utils/jwt";
import { ApiError } from "./errorHandler";
import User from "../models/User";

/**
 * Extended Request Interface
 *
 * Extends Express Request to include authenticated user information.
 * Used throughout the application to access current user data in route handlers.
 *
 * @interface AuthenticatedRequest
 * @extends {Request}
 */
export interface AuthenticatedRequest extends Request {
  /** Authenticated user information (present when user is logged in) */
  user?: {
    /** User's unique identifier */
    userId: string;
    /** User's email address */
    email: string;
    /** User's display name (cached for performance) */
    name?: string;
  };
}

/**
 * Required Authentication Middleware
 *
 * Verifies JWT token and attaches user data to request object.
 * Rejects requests without valid authentication tokens.
 *
 * This middleware should be used on protected routes that require
 * user authentication (e.g., creating dreams, accessing user data).
 *
 * @param req - Express request object (extended with user data)
 * @param res - Express response object
 * @param next - Express next function
 *
 * @throws {ApiError} 401 - When token is missing, invalid, or user doesn't exist
 */
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract JWT token from Authorization header (Bearer token format)
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new ApiError(401, "Access token is required");
    }

    // Verify token signature and decode payload
    const payload: JWTPayload = verifyToken(token);

    // Verify user still exists in database (handles deleted accounts)
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    // Attach authenticated user data to request for use in route handlers
    req.user = {
      userId: payload.userId,
      email: payload.email,
      name: user.name, // Cache name to avoid additional DB queries
    };

    next(); // Continue to next middleware/route handler
  } catch (error) {
    // Handle authentication errors appropriately
    if (error instanceof ApiError) {
      next(error); // Pass through custom API errors
    } else {
      next(new ApiError(401, "Invalid or expired token")); // Generic auth failure
    }
  }
};

/**
 * Optional Authentication Middleware
 *
 * Attaches user data to request if valid token is present, but doesn't
 * require authentication. Useful for endpoints that provide different
 * functionality for authenticated vs anonymous users.
 *
 * This middleware should be used on public routes that can benefit from
 * user context when available (e.g., public dream feed with user preferences).
 *
 * @param req - Express request object (extended with optional user data)
 * @param res - Express response object
 * @param next - Express next function

 */
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Attempt to extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      // If token exists, try to verify and attach user data
      const payload: JWTPayload = verifyToken(token);
      const user = await User.findById(payload.userId);

      if (user) {
        // Attach user data if token is valid and user exists
        req.user = {
          userId: payload.userId,
          email: payload.email,
          name: user.name,
        };
      }
    }

    // Always continue to next middleware, regardless of auth status
    next();
  } catch (error) {
    // Silently ignore authentication errors for optional auth
    // This allows the request to proceed without user context
    next();
  }
};
