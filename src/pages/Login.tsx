import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';
import { Sparkles, Zap, Shield, Rocket } from 'lucide-react';

const Login: React.FC = () => {
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
              Continue Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dream Journey
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Sign in to access your dream collection and create new magical stories
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="group flex items-start gap-4 p-5 bg-white backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Instant Access</h3>
                <p className="text-sm text-gray-700">Pick up right where you left off with your dreams</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-5 bg-white backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-300">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-700">Your dreams are safely stored and protected</p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-5 bg-white backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-pink-300">
              <div className="p-3 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors">
                <Rocket className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Unlimited Creation</h3>
                <p className="text-sm text-gray-700">Create and save unlimited dream stories</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-6 bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <p className="text-gray-800 italic mb-3">
                  "This app has transformed how I capture and remember my dreams. The AI-generated stories are absolutely magical!"
                </p>
                <div className="text-sm font-semibold text-gray-900">Alex Thompson</div>
                <div className="text-xs text-gray-600">Dream Enthusiast</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md mx-auto lg:max-w-none space-y-6 animate-in fade-in slide-in-from-right duration-700">
          {/* Mobile header */}
          <div className="text-center lg:hidden mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-700">
              Sign in to AI Dream Visualizer
            </p>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-sm text-gray-700">
              Sign in to continue your dream journey
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border-2 border-gray-200">
            <LoginForm />
          </div>

          {/* Additional info */}
          <div className="text-center text-sm text-gray-700 px-4">
            <p>
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                Sign up for free
              </button>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Secure Login
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Encrypted
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              Privacy First
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;