import React, { useEffect, useState } from "react";
import type { Dream } from "../types/dream";
import DreamCard from "./DreamCard";
import { Search, Sparkles, Cloud, TrendingUp } from "lucide-react";
import { dreamService } from "../services/dreamService";

/**
 * PublicDreamFeed Component
 *
 * Displays a feed of public dreams with search functionality and various UI states.
 * Shows community-shared dreams in a responsive grid layout.
 *
 * Features:
 * - Fetches and displays public dreams from the backend
 * - Real-time search filtering by title and description
 * - Beautiful loading states with animated elements
 * - Empty states for no dreams and no search results
 * - Responsive grid layout with staggered animations
 * - Statistics display showing dream count
 * - Pagination indicator for large datasets
 * - Error handling with graceful fallbacks
 */

interface PublicDreamFeedProps {
  /** Optional search query to filter dreams */
  searchQuery?: string;
}

const PublicDreamFeed: React.FC<PublicDreamFeedProps> = ({
  searchQuery = "",
}) => {
  // Component state management
  /** All public dreams fetched from backend */
  const [dreams, setDreams] = useState<Dream[]>([]);
  
  /** Loading state during initial data fetch */
  const [loading, setLoading] = useState(true);
  
  /** Dreams filtered by search query */
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);

  // Fetch public dreams when component mounts
  useEffect(() => {
    /**
     * Fetches public dreams from the backend service
     * Handles errors gracefully and updates component state
     */
    const fetchPublicDreams = async () => {
      try {
        // Fetch up to 50 most recent public dreams
        const result = await dreamService.getPublicDreams(1, 50);
        const dreamsData = result.dreams;
        setDreams(dreamsData);
        setFilteredDreams(dreamsData);
      } catch (error) {
        console.error("Error fetching public dreams:", error);
        // Set empty arrays on error to show appropriate empty state
        setDreams([]);
        setFilteredDreams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicDreams();
  }, []);

  // Filter dreams based on search query
  useEffect(() => {
    /**
     * Filters dreams by search query in title and description
     * Case-insensitive search across both fields
     */
    if (searchQuery.trim() === "") {
      // Show all dreams when no search query
      setFilteredDreams(dreams);
    } else {
      // Filter dreams that match search query in title or description
      const filtered = dreams.filter(
        (dream) =>
          dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dream.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDreams(filtered);
    }
  }, [searchQuery, dreams]);

  // Loading State UI with animated elements
  if (loading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        {/* Animated Background Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Multi-layered Loading Spinner */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-600 border-r-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-purple-200 rounded-full"></div>
            <div
              className="absolute inset-3 border-4 border-t-purple-600 border-r-pink-600 rounded-full animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1s" }}
            ></div>
            <Cloud className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
          </div>

          {/* Loading Message */}
          <h3 className="text-xl font-bold text-blue-600 mb-2">
            Loading Dreams
          </h3>
          <p className="text-gray-600 text-sm">
            Gathering magical stories from the community...
          </p>

          {/* Animated Loading Dots */}
          <div className="flex justify-center gap-2 mt-4">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State UI - No dreams or no search results
  if (filteredDreams.length === 0) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center py-12">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-purple-100/50 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-lg mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-200 overflow-hidden">
            {searchQuery ? (
              /* No Search Results State */
              <>
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                  <Search className="absolute inset-0 m-auto w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Dreams Found
                </h3>
                <p className="text-gray-600 mb-6 break-words">
                  We couldn't find any dreams matching{" "}
                  <span className="font-semibold text-gray-800 break-all">
                    "{searchQuery}"
                  </span>
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Try a different search term or browse all dreams
                </div>
              </>
            ) : (
              /* No Dreams Available State */
              <>
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 bg-white rounded-full"></div>
                  <Cloud className="absolute inset-0 m-auto w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Public Dreams Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  The dream gallery is waiting for its first story. Be a pioneer
                  and share your magical dream with the world!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    <Sparkles className="w-5 h-5" />
                    Create Your Dream
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Statistics and Search Info */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Dream count and title */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Community Dreams
              </h3>
              <p className="text-sm text-gray-600">
                {filteredDreams.length}{" "}
                {filteredDreams.length === 1 ? "dream" : "dreams"}
                {searchQuery && " found"}
              </p>
            </div>
          </div>

          {/* Active search indicator */}
          {searchQuery && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 max-w-xs sm:max-w-sm">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">
                Searching:{" "}
                <span className="font-semibold text-gray-900">
                  {searchQuery}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dreams Grid with Staggered Animation */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:gap-6">
        {filteredDreams.map((dream, index) => (
          <div
            key={dream.id}
            className="animate-in fade-in duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <DreamCard dream={dream} />
          </div>
        ))}
      </div>

      {/* Pagination Indicator - Shows when at data limit */}
      {dreams.length >= 50 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-gray-700">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Showing the 50 most recent dreams
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicDreamFeed;
