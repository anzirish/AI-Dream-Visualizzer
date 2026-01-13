// Authentication type definitions for the AI Dreams application

export interface User {
  uid: string; email: string; 
  name: string; 
  createdAt: string; 
}

// Authentication context interface defining the shape of auth state and methods
export interface AuthContextType {
  user: User | null; 
  loading: boolean; 
  login: (email: string, password: string) => Promise<void>; 
  signup: (email: string, password: string, name: string) => Promise<void>; 
  logout: () => Promise<void>; 
}

// Form data structure for login form inputs
export interface LoginFormData {
  email: string;
  password: string; 
}

// Form data structure for signup form inputs
export interface SignupFormData {
  name: string; 
  email: string; 
  password: string; 
  confirmPassword: string; 
}
