import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PublicDreamFeed } from "@/features/dreams";
import { useAuth } from "@/features/auth";

/**
 * Home Page Component
 *
 * Landing page for the AI Dreams application that serves as the main entry point.
 * Displays different content based on user authentication status and provides access
 * to public dream content.
 *
 * Features:
 * - Hero section with dynamic CTAs based on auth status
 * - Search functionality for public dreams
 * - Public dream feed for browsing community content
 * - Responsive design for all screen sizes
 * - Loading states during authentication check
 * - Different action buttons for authenticated vs unauthenticated users
 */
const Home: React.FC = () => {
  // Authentication state for conditional rendering
  const { user, loading } = useAuth();

  /** Search query state for filtering public dreams */
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section - Main landing area */}
        <div className="text-center mb-8">
          {/* Main heading with brand emphasis */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Welcome to the <span className="text-blue-600">World of Dreams</span>
          </h1>
          {/* Subtitle describing the app's purpose */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Transform your dreams into beautiful, AI-generated stories
          </p>

          {/* Call-to-Action Buttons - Dynamic based on auth state */}
          {loading ? (
            /* Loading state during authentication check */
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-3 px-6 py-3 bg-white rounded-lg shadow-lg border border-gray-200">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600 font-medium">Loading...</span>
              </div>
            </div>
          ) : user ? (
            /* Authenticated user actions */
            <div className="flex justify-center gap-4 mb-8">
              <Link to="/create-dream">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105">
                  Create Dream ✨
                </button>
              </Link>
              <Link to="/my-dreams">
                <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg shadow-lg border border-gray-300 transition-all">
                  My Dreams
                </button>
              </Link>
            </div>
          ) : (
            /* Unauthenticated user actions */
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

        {/* Search Bar for Public Dreams */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            {/* Search input with icon */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search public dreams by title..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Search icon */}
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Public Dreams Feed Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Explore Public Dreams 🌙</h2>
          {/* Public dream feed component with search functionality */}
          <PublicDreamFeed searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default Home;
