import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicDreamFeed from '../components/dream/PublicDreamFeed';
import { useAuth } from '@/hooks/useAuth.ts';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Welcome to the{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              World of Dremas
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Transform your dreams into beautiful, AI-generated stories
          </p>

          {/* CTA Buttons */}
          {user && (
            <div className="flex justify-center gap-4 mb-8">
              <Link to="/create-dream">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105">
                  Create Dream ✨
                </button>
              </Link>
              <Link to="/my-dreams">
                <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-lg border border-gray-300 transition-all">
                  My Dreams
                </button>
              </Link>
            </div>
          )}

          {!user && (
            <div className="flex justify-center gap-4 mb-8">
              <Link to="/login">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all">
                  Login to Start
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-lg border border-gray-300 transition-all">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search public dreams by title..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Public Dreams Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Explore Public Dreams 🌙
          </h2>
          <PublicDreamFeed searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default Home;