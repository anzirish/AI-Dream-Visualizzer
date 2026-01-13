import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader, JWTPayload } from "../utils/jwt";
import { ApiError } from "./errorHandler";
import User from "../models/User";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name?: string;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new ApiError(401, "Access token is required");
    }

    const payload: JWTPayload = verifyToken(token);

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, "Invalid or expired token"));
    }
  }
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload: JWTPayload = verifyToken(token);
      const user = await User.findById(payload.userId);

      if (user) {
        req.user = {
          userId: payload.userId,
          email: payload.email,
          name: user.name,
        };
      }
    }

    next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    next();
  }
};
