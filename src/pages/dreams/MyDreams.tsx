import React, { useEffect, useState, useCallback } from "react";
import type { Dream } from "@/features/dreams";
import { Link } from "react-router-dom";
import { DreamCard } from "@/features/dreams";
import { useAuth } from "@/features/auth";
import { dreamService } from "@/features/dreams/services/dreamService";

// Personal dashboard page displaying all dreams created by the authenticated user
const MyDreams: React.FC = () => {
  const { user } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetches user's dreams from the backend
  const fetchDreams = useCallback(async () => {
    if (!user) return;

    try {
      const dreamsData = await dreamService.getMyDreams();
      setDreams(dreamsData);
    } catch (error) {
      console.error("Error fetching dreams:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch dreams when component mounts or user changes
  useEffect(() => {
    fetchDreams();
  }, [user, fetchDreams]);

  // Handles dream deletion with optimistic UI updates
  const handleDelete = async (dreamId: string) => {
    try {
      await dreamService.deleteDream(dreamId);
      setDreams(dreams.filter((dream) => dream.id !== dreamId));
    } catch (error) {
      console.error("Error deleting dream:", error);
      alert("Failed to delete dream. Please try again.");
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* Loading spinner */}
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading your dreams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Dream <span className="text-blue-600">Collection</span>
          </h1>
          <p className="text-xl text-gray-600">
            Revisit the stories born from your dreams
          </p>
        </div>

        {/* Conditional Content: Empty State vs Dreams Grid */}
        {dreams.length === 0 ? (
          // Empty State - No dreams created yet
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              {/* Empty state icon */}
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No dreams yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start creating your first dream story!
              </p>
              {/* Call-to-action button */}
              <Link to="/create-dream">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                  Create Your First Dream ✨
                </button>
              </Link>
            </div>
          </div>
        ) : (
          // Dreams Grid - Display user's dreams
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dreams.map((dream) => (
              <DreamCard
                key={dream.id}
                dream={dream}
                showDelete={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDreams;
