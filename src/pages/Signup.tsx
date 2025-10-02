import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import SignupForm from '@/components/auth/SignUpForm';
import { Sparkles, Wand2, Image as ImageIcon, Users } from 'lucide-react';

const Signup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/40 to-purple-50/40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Marketing content */}
        <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Dream Visualizer
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Transform your dreams into stunning visual stories powered by advanced AI technology
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-4">
            <div className="group flex items-start gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Wand2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Stories</h3>
                <p className="text-sm text-gray-600">Let AI transform your dreams into captivating narratives</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-300">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <ImageIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Beautiful Visualizations</h3>
                <p className="text-sm text-gray-600">Get stunning AI-generated images of your dreams</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-pink-300">
              <div className="p-3 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Share with Community</h3>
                <p className="text-sm text-gray-600">Connect with dreamers and share your creative visions</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                1000+
              </div>
              <div className="text-xs text-gray-600 mt-1">Dreams Created</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-xs text-gray-600 mt-1">Active Dreamers</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-xs text-gray-600 mt-1">Free to Use</div>
            </div>
          </div>
        </div>

        {/* Right side - Signup form */}
        <div className="w-full max-w-md mx-auto lg:max-w-none space-y-6 animate-in fade-in slide-in-from-right duration-700">
          {/* Mobile header */}
          <div className="text-center lg:hidden mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join AI Dream Visualizer and start creating amazing dream stories
            </p>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-sm text-gray-600">
              Start your journey into the world of dream visualization
            </p>
          </div>

          {/* Signup Card */}
          <Card className="border-2 border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Sign Up</CardTitle>
              <CardDescription className="text-gray-600">
                Create a new account to get started with AI Dream Visualizer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm />
            </CardContent>
          </Card>

          {/* Additional info */}
          <div className="text-center text-sm text-gray-600 px-4">
            <p>
              By signing up, you agree to our{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium underline">
                Terms of Service
              </button>
              {' '}and{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium underline">
                Privacy Policy
              </button>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Secure
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Fast Setup
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Free Forever
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;