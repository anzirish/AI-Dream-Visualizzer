import React, { useEffect, useState } from "react";
import type { Dream } from "../types/dream";
import DreamCard from "./DreamCard";
import { dreamService } from "../services/dreamService";

interface PublicDreamFeedProps {
  searchQuery?: string;
}

// Simplified public dreams feed
const PublicDreamFeed: React.FC<PublicDreamFeedProps> = ({
  searchQuery = "",
}) => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);

  // Fetch public dreams
  useEffect(() => {
    const fetchPublicDreams = async () => {
      try {
        const dreams = await dreamService.getPublicDreams(1, 50);
        setDreams(dreams);
        setFilteredDreams(dreams);
      } catch (error) {
        console.error("Error fetching dreams:", error);
        setDreams([]);
        setFilteredDreams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicDreams();
  }, []);

  // Filter dreams by search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDreams(dreams);
    } else {
      const filtered = dreams.filter(
        (dream) =>
          dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dream.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDreams(filtered);
    }
  }, [searchQuery, dreams]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dreams...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredDreams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? "No dreams found" : "No public dreams yet"}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No dreams match "${searchQuery}"`
              : "Be the first to share a dream with the community!"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Community Dreams
        </h3>
        <p className="text-sm text-gray-600">
          {filteredDreams.length} {filteredDreams.length === 1 ? "dream" : "dreams"}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Dreams grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDreams.map((dream) => (
          <DreamCard key={dream.id} dream={dream} />
        ))}
      </div>
    </div>
  );
};

export default PublicDreamFeed;
