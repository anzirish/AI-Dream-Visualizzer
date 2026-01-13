import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// JWT Payload Interface - Defines the structure of data encoded in JWT tokens
export interface JWTPayload {
  // User's unique identifier as string
  userId: string;
  // User's email address
  email: string;
}

// Generate JWT Authentication Token - Creates a signed JWT token containing user identification information
export const generateToken = (userId: Types.ObjectId, email: string): string => {
  // Create JWT payload with user identification data
  const payload: JWTPayload = {
    userId: userId.toString(), // Convert ObjectId to string for JSON compatibility
    email,
  };

  // Validate JWT secret is configured
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  // Get token expiration time from environment or use default

  // Sign and return the JWT token
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

// Verify and Decode JWT Token - Validates a JWT token's signature and expiration, then returns the decoded payload
export const verifyToken = (token: string): JWTPayload => {
  // Validate JWT secret is configured
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  try {
    // Verify token signature and decode payload
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    // Handle different JWT verification errors with specific messages
    // This helps with debugging and provides appropriate error responses
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    // Catch-all for other verification failures
    throw new Error("Token verification failed");
  }
};

// Extract JWT Token from Authorization Header - Parses the Authorization header to extract the JWT token
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  // Return null if no Authorization header is provided
  if (!authHeader) {
    return null;
  }

  // Parse header expecting "Bearer <token>" format
  const parts = authHeader.split(" ");

  // Validate format: exactly 2 parts with "Bearer" prefix
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  // Return the token portion
  return parts[1];
};
