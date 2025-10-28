import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { SignupFormData } from "../types/auth";
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from "@/shared/utils/validation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { User, Mail, Lock, CheckCircle2, AlertCircle, UserPlus } from "lucide-react";

/**
 * SignUpForm Component
 *
 * A comprehensive user registration form for the AI Dreams application.
 * Handles user account creation with real-time validation and error handling.
 *
 * Features:
 * - Real-time form validation for all fields
 * - Password confirmation matching
 * - Email format validation
 * - Name length validation
 * - Loading states during submission
 * - Error handling with user-friendly messages
 * - Responsive design with mobile-first approach
 * - Accessibility features (proper labels, ARIA attributes)
 */
const SignupForm: React.FC = () => {
  // Hooks for authentication and navigation
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Form state management
  /** Main form data containing all user input fields */
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /** Field-specific validation errors */
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});

  /** Loading state during form submission */
  const [isLoading, setIsLoading] = useState(false);

  /** Authentication-related error messages from the backend */
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
    if (errors[name as keyof SignupFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear authentication error when user makes changes
    if (authError) setAuthError("");
  };

  /**
   * Validates all form fields using shared validation utilities
   *
   * @returns {boolean} - True if all fields are valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    // Validate each field using shared validation functions
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    // Update error state and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission with validation and error handling
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
      // Attempt to create user account via auth context
      await signup(formData.email, formData.password, formData.name);

      // Redirect to home page on successful signup
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle specific authentication errors with user-friendly messages
      if (error.code === "auth/email-already-in-use") {
        setAuthError("An account with this email already exists.");
      } else if (error.code === "auth/invalid-email") {
        setAuthError("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setAuthError("Password is too weak.");
      } else {
        setAuthError("An error occurred while creating your account. Please try again.");
      }
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <User className="w-4 h-4 text-green-600" />
            Full Name
          </label>
          <div className="relative">
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              autoComplete="name"
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-green-500 hover:border-gray-300"
              }`}
            />
          </div>
          {errors.name && (
            <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Mail className="w-4 h-4 text-blue-600" />
            Email Address
          </label>
          <div className="relative">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              }`}
            />
          </div>
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
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-purple-500 hover:border-gray-300"
              }`}
            />
          </div>
          {errors.password && (
            <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <CheckCircle2 className="w-4 h-4 text-pink-600" />
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-pink-500 hover:border-gray-300"
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.confirmPassword}</span>
            </div>
          )}
        </div>

        {/* Auth Error */}
        {authError && (
          <Alert variant="destructive" className="border-2 border-red-300 bg-red-50">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <AlertDescription className="text-red-800 font-medium">{authError}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="group relative w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none overflow-hidden"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </span>
        </Button>
      </form>

      {/* Sign in link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
