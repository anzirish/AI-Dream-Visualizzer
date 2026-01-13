import React, { useState } from "react";
import type { DreamFormData } from "../types/dream";
import { useAuth } from "@/features/auth";
import { dreamService } from "../services/dreamService";

interface StoryDisplayProps {
  story: string;
  dreamData: DreamFormData;
  image?: string;
  onReset: () => void;
}

// Simplified story display component
const StoryDisplay: React.FC<StoryDisplayProps> = ({
  story,
  dreamData,
  image,
  onReset,
}) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSave = async () => {
    if (!user) {
      setError("You must be logged in to save dreams");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const dreamToSave = {
        title: dreamData.title,
        description: dreamData.description,
        generatedStory: story,
        generatedImage: image || "",
        isPublic: isPublic,
      };

      await dreamService.createDream(dreamToSave);
      setIsSaved(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewDream = () => {
    setIsSaved(false);
    setError("");
    setIsPublic(false);
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow border max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-blue-50 border-b p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Dream Story
        </h2>
        <p className="text-gray-600">
          "{dreamData.title}"
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Image */}
        {image && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Dream Image
            </h3>
            <img
              src={image}
              alt="Dream visualization"
              className="w-full max-w-md mx-auto rounded-lg border"
            />
          </div>
        )}

        {/* Story */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Generated Story
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 border">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {story}
            </p>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Privacy
          </h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="privacy"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
              />
              <span className="text-sm">Private</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="privacy"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
              />
              <span className="text-sm">Public</span>
            </label>
          </div>
        </div>

        {/* Messages */}
        {isSaved && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700 text-sm">
              Dream saved successfully!
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded transition-colors"
          >
            {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Dream"}
          </button>

          <button
            onClick={handleNewDream}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Create New Dream
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;
