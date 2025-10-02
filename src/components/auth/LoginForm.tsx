import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData } from '@/types/auth';
import { validateEmail, validatePassword } from '../../utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (authError) setAuthError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setAuthError('');
    
    try {
      await login(formData.email, formData.password);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setAuthError('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        setAuthError('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Invalid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        setAuthError('Too many failed attempts. Please try again later.');
      } else {
        setAuthError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
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
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.password 
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-purple-500 hover:border-gray-300'
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

        {/* Auth Error */}
        {authError && (
          <Alert variant="destructive" className="border-2 border-red-300 bg-red-50">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <AlertDescription className="text-red-800 font-medium">
                {authError}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="group relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none overflow-hidden"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
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
      
      {/* Sign up link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-700">
          Don't have an account?{' '}
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