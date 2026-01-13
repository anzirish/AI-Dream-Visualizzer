// Authentication type definitions for the AI Dreams application

// User data structure representing an authenticated user
export interface User {
  uid: string; // Unique user identifier from backend
  email: string; // User's email address
  name: string; // User's full name
  createdAt: string; // Account creation timestamp (ISO string format from backend)
}

// Authentication context interface defining the shape of auth state and methods
export interface AuthContextType {
  user: User | null; // Currently authenticated user or null if not logged in
  loading: boolean; // Loading state during authentication operations
  login: (email: string, password: string) => Promise<void>; // Function to authenticate user with email and password
  signup: (email: string, password: string, name: string) => Promise<void>; // Function to create new user account
  logout: () => Promise<void>; // Function to log out current user
}

// Form data structure for login form inputs
export interface LoginFormData {
  email: string; // User's email address
  password: string; // User's password
}

// Form data structure for signup form inputs
export interface SignupFormData {
  name: string; // User's full name
  email: string; // User's email address
  password: string; // User's chosen password
  confirmPassword: string; // Password confirmation for validation
}
