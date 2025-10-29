/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";

/**
 * Custom API Error Class
 *
 * Extends the native Error class to provide structured error handling
 * with HTTP status codes and operational error classification.
 *
 * @class ApiError
 * @extends {Error}
 */
export class ApiError extends Error {
  /** HTTP status code for the error response */
  public statusCode: number;

  /** Whether this is an operational error (expected) vs programming error */
  public isOperational: boolean;

  /**
   * Creates a new API error with status code and message
   *
   * @param statusCode - HTTP status code (400, 401, 404, 500, etc.)
   * @param message - Human-readable error message
   * @param isOperational - Whether this is an expected operational error

   */
  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handling Middleware
 *
 * Centralized error handler that catches all errors thrown in the application
 * and converts them to appropriate HTTP responses. Handles various error types
 * including database errors, validation errors, and JWT errors.
 *
 * This middleware should be registered last in the middleware chain to catch
 * all errors from previous middleware and route handlers.
 *
 * @param err - The error object thrown by the application
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function (unused but required for error middleware)
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Create a copy of the error to avoid mutation
  let error = { ...err } as ApiError;
  error.message = err.message;

  // Log error details for debugging and monitoring
  console.error("Error:", err);

  /**
   * Error Type Handling
   *
   * Convert various error types to appropriate ApiError instances
   * with user-friendly messages and correct HTTP status codes.
   */

  // Mongoose CastError - Invalid ObjectId format
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ApiError(404, message);
  }

  // Mongoose Duplicate Key Error - Unique constraint violation
  if ((err as any).code === 11000) {
    const message = "Duplicate field value entered";
    error = new ApiError(400, message);
  }

  // Mongoose Validation Error - Schema validation failed
  if (err.name === "ValidationError") {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(", ");
    error = new ApiError(400, message);
  }

  // JWT Verification Errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new ApiError(401, message);
  }

  // JWT Expiration Error
  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new ApiError(401, message);
  }

  /**
   * Send Error Response
   *
   * Return standardized error response with appropriate status code.
   * Include stack trace only in development for debugging.
   */
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
  });
};
