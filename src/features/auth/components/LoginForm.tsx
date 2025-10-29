import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { LoginFormData } from "../types/auth";
import { validateEmail, validatePassword } from "@/shared/utils/validation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

/**
 * LoginForm Component
 *
 * User authentication form for the AI Dreams application.
 * Handles user login with validation and comprehensive error handling.
 *
 * Features:
 * - Real-time form validation
 * - Email and password validation
 * - Loading states during authentication
 * - Specific error messages for different auth failures
 * - Responsive design with visual feedback
 * - Accessibility features with proper labels
 */
const LoginForm: React.FC = () => {
  // Hooks for authentication and navigation
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form state management
  /** User input data for email and password */
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  /** Field-specific validation errors */
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  /** Loading state during authentication process */
  const [isLoading, setIsLoading] = useState(false);

  /** Authentication error messages from backend */
  const [authError, setAuthError] = useState("");

  /**
   * Handles input field changes and clears related errors
   *
   * @param e - React change event from input fields
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data with new value
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear authentication error when user makes changes
    if (authError) setAuthError("");
  };

  /**
   * Validates form fields using shared validation utilities
   *
   * @returns {boolean} - True if all fields are valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    // Validate email format
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Validate password requirements
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Update error state and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission with authentication and error handling
   *
   * @param e - React form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) return;

    // Set loading state and clear previous errors
    setIsLoading(true);
    setAuthError("");

    try {
      // Attempt user authentication
      await login(formData.email, formData.password);

      // Redirect to home page on successful login
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle authentication errors with backend error message
      setAuthError(error.message || "Login failed. Please try again.");
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Address Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Mail className="w-4 h-4 text-blue-600" />
            Email Address
          </label>
          <div className="relative">
            {/* Email input with validation styling */}
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="dev@example.com"
              autoComplete="email"
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              }`}
            />
          </div>
          {/* Email validation error display */}
          {errors.email && (
            <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Lock className="w-4 h-4 text-purple-600" />
            Password
          </label>
          <div className="relative">
            {/* Password input with validation styling */}
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-purple-500 hover:border-gray-300"
              }`}
            />
          </div>
          {/* Password validation error display */}
          {errors.password && (
            <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        {/* Authentication Error Alert */}
        {authError && (
          <Alert variant="destructive" className="border-2 border-red-300 bg-red-50">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <AlertDescription className="text-red-800 font-medium">{authError}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Submit Button with Loading State */}
        <Button
          type="submit"
          disabled={isLoading}
          className="group relative w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none overflow-hidden"
        >
          {/* Animated shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

          {/* Button content with dynamic loading state */}
          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                {/* Loading spinner */}
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </span>
        </Button>
      </form>

      {/* Navigation Link to Sign Up */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
