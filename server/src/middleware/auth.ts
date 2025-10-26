import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';
import { ApiError } from './errorHandler';
import User from '../models/User';

/**
 * Extended Request interface to include user data
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user data to request
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      throw new ApiError(401, 'Access token is required');
    }

    // Verify and decode token
    const payload: JWTPayload = verifyToken(token);

    // Verify user still exists in database
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    // Attach user data to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Invalid or expired token'));
    }
  }
};

/**
 * Optional authentication middleware
 * Attaches user data if token is present, but doesn't require it
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const payload: JWTPayload = verifyToken(token);
      const user = await User.findById(payload.userId);
      
      if (user) {
        req.user = {
          userId: payload.userId,
          email: payload.email,
        };
      }
    }
    
    // Continue regardless of token presence/validity
    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};