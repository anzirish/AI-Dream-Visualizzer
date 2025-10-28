import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

/**
 * useAuth Hook
 *
 * Custom React hook for accessing authentication state and methods.
 * Provides a convenient way to consume the AuthContext in components.
 *
 * Features:
 * - Access to current user data
 * - Authentication loading states
 * - Login, signup, and logout methods
 * - Automatic error handling for context usage
 * - Type-safe access to auth functionality
 *
 * @throws {Error} When used outside of AuthProvider
 * @returns {AuthContextType} Authentication context value with user state and methods
 */
export const useAuth = () => {
  // Get authentication context
  const context = useContext(AuthContext);
  
  // Ensure hook is used within AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};