import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PublicDreamFeed } from "@/features/dreams";
import { useAuth } from "@/features/auth";

// Home page component
const Home: React.FC = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Welcome to <span className="text-blue-600">AI Dreams</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Transform your dreams into AI-generated stories
          </p>

          {/* Action Buttons */}
          {loading ? (
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-white rounded border">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                Loading...
              </div>
            </div>
          ) : user ? (
            <div className="flex justify-center gap-4 mb-8">
              <Link to="/create-dream">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded">
                  Create Dream
                </button>
              </Link>
              <Link to="/my-dreams">
                <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border rounded">
                  My Dreams
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center gap-4 mb-8">
              <Link to="/login">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border rounded">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dreams..."
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Public Dreams */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Public Dreams</h2>
          <PublicDreamFeed searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default Home;
