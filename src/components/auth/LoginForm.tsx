import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData } from '@/types/auth';
import { validateEmail, validatePassword } from '../../utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            autoComplete="email"
            className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {authError && (
          <Alert variant="destructive">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;