import React, { createContext, useEffect, useState } from "react";
import { backendAPI } from "@/services/api/backend";
import type { User, AuthContextType } from "../types/auth";

/**
 * AuthContext - React Context for Authentication State Management
 *
 * Provides centralized authentication state and methods throughout the application.
 * Handles user authentication, session persistence, and automatic token validation.
 *
 * Features:
 * - Persistent authentication state via localStorage
 * - Automatic token validation on app startup
 * - Centralized login/logout/signup methods
 * - Loading states for authentication operations
 * - Error handling for authentication failures
 */

// Create authentication context with undefined default
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * AuthProvider Component
 *
 * Provides authentication context to child components.
 * Manages user state, authentication status, and session persistence.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Authentication state management
  /** Current authenticated user or null if not logged in */
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user state from localStorage cache on app start
    try {
      const cachedUser = localStorage.getItem("dreamapp_user");
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      // Handle corrupted localStorage data gracefully
      return null;
    }
  });
  
  /** Loading state for authentication operations */
  const [loading, setLoading] = useState(true);

  // Authentication validation on app startup
  useEffect(() => {
    /**
     * Validates existing authentication token and user session
     * Runs once when the app initializes to restore authentication state
     */
    const checkAuth = async () => {
      try {
        // Check if user has a valid authentication token
        if (backendAPI.isAuthenticated()) {
          // Fetch current user data from backend
          const currentUser = await backendAPI.getCurrentUser();
          if (currentUser) {
            // Valid user session - update state and cache
            setUser(currentUser);
            localStorage.setItem("dreamapp_user", JSON.stringify(currentUser));
          } else {
            // Invalid token - clear authentication state
            setUser(null);
            localStorage.removeItem("dreamapp_user");
          }
        } else {
          // No token found - ensure clean state
          setUser(null);
          localStorage.removeItem("dreamapp_user");
        }
      } catch (error) {
        // Authentication check failed - clear all auth data
        console.error("Auth check failed:", error);
        setUser(null);
        localStorage.removeItem("dreamapp_user");
      } finally {
        // Always set loading to false after auth check completes
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Creates a new user account and logs them in
   * 
   * @param email - User's email address
   * @param password - User's password
   * @param name - User's full name
   */
  const signup = async (email: string, password: string, name: string) => {
    // Create new user account via backend API
    const newUser = await backendAPI.signup(name, email, password);
    
    // Update authentication state
    setUser(newUser);
    
    // Persist user data in localStorage for session continuity
    localStorage.setItem("dreamapp_user", JSON.stringify(newUser));
  };

  /**
   * Authenticates existing user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   */
  const login = async (email: string, password: string) => {
    // Authenticate user via backend API
    const loggedInUser = await backendAPI.login(email, password);
    
    // Update authentication state
    setUser(loggedInUser);
    
    // Persist user data in localStorage for session continuity
    localStorage.setItem("dreamapp_user", JSON.stringify(loggedInUser));
  };

  /**
   * Logs out the current user and clears all authentication data
   */
  const logout = async () => {
    // Notify backend of logout (invalidate token)
    await backendAPI.logout();
    
    // Clear authentication state
    setUser(null);
    
    // Remove cached user data
    localStorage.removeItem("dreamapp_user");
  };

  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};