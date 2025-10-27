import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { ApiError } from "../middleware/errorHandler";

/**
 * User Registration Handler
 *
 * Creates a new user account with email and password authentication.
 * Validates input data, checks for existing users, and generates JWT token.
 *
 * @route POST /api/v1/auth/signup
 * @access Public
 *
 * @param req - Express request object containing user registration data
 * @param res - Express response object
 * @param next - Express next function for error handling
 *
 * @throws {ApiError} 400 - When required fields are missing or user exists
 */
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email");
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // Will be hashed by the pre-save middleware
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          uid: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          uid: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/v1/auth/me
 */
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // User ID is attached by auth middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          uid: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user (client-side token removal)
 * POST /api/v1/auth/logout
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Since we're using stateless JWT, logout is handled client-side
    // This endpoint exists for consistency and future token blacklisting
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
