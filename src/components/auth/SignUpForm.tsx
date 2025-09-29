import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { SignupFormData } from '@/types/auth';
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from '../../utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (authError) setAuthError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setAuthError('');
    
    try {
      await signup(formData.email, formData.password, formData.name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Password is too weak.');
      } else {
        setAuthError('An error occurred while creating your account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            autoComplete="name"
            className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
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
            autoComplete="new-password"
            className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Confirm Password</label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            autoComplete="new-password"
            className={errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {authError && (
          <Alert variant="destructive">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;