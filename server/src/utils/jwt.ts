import jwt from "jsonwebtoken";
import { Types } from "mongoose";

/**
 * JWT payload interface
 */
export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Generate JWT token for user authentication
 * @param userId - User's MongoDB ObjectId
 * @param email - User's email address
 * @returns JWT token string
 */
export const generateToken = (
  userId: Types.ObjectId,
  email: string
): string => {
  const payload: JWTPayload = {
    userId: userId.toString(),
    email,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  const expiresIn = process.env.JWT_EXPIRE || "7d";

  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null if not found
 */
export const extractTokenFromHeader = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader) {
    return null;
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
};
