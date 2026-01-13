import React, { createContext, useEffect, useState } from "react";
import { backendAPI } from "@/services/api/backend";
import type { User, AuthContextType } from "../types/auth";

// Create authentication context with undefined default
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// AuthProvider component that provides authentication context to child components
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user state from localStorage cache on app start
    try {
      const cachedUser = localStorage.getItem("dreamapp_user");
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      return null;
    }
  });
  
  const [loading, setLoading] = useState(true);

  // Authentication validation on app startup
  useEffect(() => {
    // Validates existing authentication token and user session
    const checkAuth = async () => {
      try {
        if (backendAPI.isAuthenticated()) {
          const currentUser = await backendAPI.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem("dreamapp_user", JSON.stringify(currentUser));
          } else {
            setUser(null);
            localStorage.removeItem("dreamapp_user");
          }
        } else {
          setUser(null);
          localStorage.removeItem("dreamapp_user");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        localStorage.removeItem("dreamapp_user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Creates a new user account and logs them in
  const signup = async (email: string, password: string, name: string) => {
    const newUser = await backendAPI.signup(name, email, password);
    setUser(newUser);
    localStorage.setItem("dreamapp_user", JSON.stringify(newUser));
  };

  // Authenticates existing user with email and password
  const login = async (email: string, password: string) => {
    const loggedInUser = await backendAPI.login(email, password);
    setUser(loggedInUser);
    localStorage.setItem("dreamapp_user", JSON.stringify(loggedInUser));
  };

  // Logs out the current user and clears all authentication data
  const logout = async () => {
    await backendAPI.logout();
    setUser(null);
    localStorage.removeItem("dreamapp_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};