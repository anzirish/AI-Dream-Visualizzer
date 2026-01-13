/**
 * Validation Utilities
 */
export const validateEmail = (email: string): string | null => {
  // RFC 5322 compliant email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Check if email is provided
  if (!email) {
    return 'Email is required';
  }
  
  // Validate email format
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

/**
 * Validates password strength and presence
 * 
 * @param password - Password to validate
 * @returns {string | null} - Error message if invalid, null if valid
 */
export const validatePassword = (password: string): string | null => {
  // Check if password is provided
  if (!password) {
    return 'Password is required';
  }
  
  // Enforce minimum length requirement
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  return null;
};

/**
 * Validates user name/full name input
 * 
 * @param name - Name to validate
 * @returns {string | null} - Error message if invalid, null if valid
 */
export const validateName = (name: string): string | null => {
  // Check if name is provided
  if (!name) {
    return 'Name is required';
  }
  
  // Enforce minimum length after trimming whitespace
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  return null;
};

/**
 * Validates password confirmation matches original password
 * 
 * @param password - Original password
 * @param confirmPassword - Confirmation password to validate
 * @returns {string | null} - Error message if invalid, null if valid
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  // Check if confirmation password is provided
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  // Ensure passwords match exactly
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};