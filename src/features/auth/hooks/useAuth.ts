import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

/**
 * useAuth Hook
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