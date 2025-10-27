import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { Menu, X, LogOut, Home, PlusCircle, Moon, Settings } from "lucide-react";

/**
 * NavBar Component
 *
 * Main navigation component for the AI Dreams application.
 * Provides responsive navigation with authentication-aware menu items.
 *
 * Features:
 * - Responsive design (desktop and mobile layouts)
 * - Authentication-aware navigation (different menus for logged in/out users)
 * - Active route highlighting
 * - Mobile hamburger menu with smooth transitions
 * - User profile display with avatar
 * - Logout functionality
 * - Loading states during authentication
 * - Sticky positioning for persistent navigation
 */
const NavBar: React.FC = () => {
  // Hooks for authentication, navigation, and routing
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /** State for mobile menu visibility */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Handles user logout and redirects to login page
   */
  const handleLogout = async () => {
    try {
      // Perform logout via auth context
      await logout();

      // Redirect to login page after successful logout
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  /**
   * Determines if a navigation link is currently active
   *
   * @param path - The route path to check
   * @returns {boolean} - True if the current route matches the path
   */
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Application Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                {/* Dream/lightbulb icon SVG */}
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </Link>

            {/* Desktop Navigation Links - Only shown when user is authenticated */}
            {user && (
              <div className="hidden md:flex items-center space-x-1">
                {/* Home link with active state styling */}
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive("/") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                {/* Create Dream link */}
                <Link
                  to="/create-dream"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive("/create-dream")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Dream</span>
                </Link>
                {/* My Dreams link */}
                <Link
                  to="/my-dreams"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive("/my-dreams")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>My Dreams</span>
                </Link>
                {/* API Settings link */}
                <Link
                  to="/api-settings"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive("/api-settings")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>API Settings</span>
                </Link>
              </div>
            )}
          </div>

          {/* Right Side - User Information and Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              /* Loading state during authentication check */
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              /* Authenticated user section */
              <div className="flex items-center space-x-4">
                {/* User profile display */}
                <div className="flex items-center space-x-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                  {/* User avatar with first letter of name */}
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* Unauthenticated user section */
              <div className="flex items-center space-x-3">
                {/* Login button */}
                <Link to="/login">
                  <button className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow">
                    Login
                  </button>
                </Link>
                {/* Sign up button */}
                <Link to="/signup">
                  <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-2">
            {loading ? (
              /* Loading spinner for mobile */
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : (
              /* Hamburger menu button */
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {/* Toggle between hamburger and X icon */}
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Only shown when menu is open and not loading */}
      {mobileMenuOpen && !loading && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {user ? (
              /* Authenticated user mobile menu */
              <>
                {/* User profile section */}
                <div className="flex items-center space-x-3 px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>

                {/* Mobile navigation links */}
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive("/") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/create-dream"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive("/create-dream") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Dream</span>
                </Link>
                <Link
                  to="/my-dreams"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive("/my-dreams") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <span>My Dreams</span>
                </Link>
                <Link
                  to="/api-settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive("/api-settings") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>API Settings</span>
                </Link>

                {/* Mobile logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              /* Unauthenticated user mobile menu */
              <div className="space-y-3">
                {/* Mobile login button */}
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                  <button className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                    Login
                  </button>
                </Link>
                {/* Mobile sign up button */}
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block">
                  <button className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-md">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
