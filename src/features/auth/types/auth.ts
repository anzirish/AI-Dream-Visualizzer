/**
 * Authentication Type Definitions
 *
 * TypeScript interfaces and types for authentication-related data structures
 * used throughout the AI Dreams application.
 */

/**
 * User data structure representing an authenticated user
 */
export interface User {
  /** Unique user identifier from backend */
  uid: string;
  /** User's email address */
  email: string;
  /** User's full name */
  name: string;
  /** Account creation timestamp (ISO string format from backend) */
  createdAt: string;
}

/**
 * Authentication context interface defining the shape of auth state and methods
 * provided by the AuthContext to consuming components
 */
export interface AuthContextType {
  /** Currently authenticated user or null if not logged in */
  user: User | null;
  /** Loading state during authentication operations */
  loading: boolean;
  /** Function to authenticate user with email and password */
  login: (email: string, password: string) => Promise<void>;
  /** Function to create new user account */
  signup: (email: string, password: string, name: string) => Promise<void>;
  /** Function to log out current user */
  logout: () => Promise<void>;
}

/**
 * Form data structure for login form inputs
 */
export interface LoginFormData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Form data structure for signup form inputs
 */
export interface SignupFormData {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's chosen password */
  password: string;
  /** Password confirmation for validation */
  confirmPassword: string;
}
