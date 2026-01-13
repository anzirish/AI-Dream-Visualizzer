import React, { useState } from "react";
import type { DreamFormData } from "../types/dream";
import { useAuth } from "@/features/auth";
import { dreamService } from "../services/dreamService";
import { compressBase64Image } from "@/shared/utils";

interface StoryDisplayProps {
  story: string;
  dreamData: DreamFormData;
  image?: string;
  onReset: () => void;
}

// Component to display generated dream story and image
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
      const compressedImage = image ? await compressBase64Image(image, 512, 0.7) : "";
      
      const dreamToSave = {
        title: dreamData.title,
        description: dreamData.description,
        generatedStory: story,
        generatedImage: compressedImage,
        isPublic: isPublic,
      };

      await dreamService.createDream(dreamToSave);
      setIsSaved(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error saving dream:", error);
      setError(`Failed to save: ${error.message}`);
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
          Generated from: <span className="font-medium">"{dreamData.title}"</span>
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Section */}
          {image && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Dream Visualization
              </h3>
              <div className="rounded-lg overflow-hidden border bg-gray-100">
                <img
                  src={image}
                  alt="AI Dream Visualization"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Story Section */}
          <div className={image ? "" : "lg:col-span-2"}>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Dream Story
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 border">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {story}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Privacy Settings
          </h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="privacy"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Private</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="privacy"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Public</span>
            </label>
          </div>
        </div>

        {/* Messages */}
        {isSaved && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700 text-sm">
              Dream saved successfully! It's now {isPublic ? "public" : "private"}.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
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

        <p className="text-center text-xs text-gray-500 mt-4">
          Your dream will be {isPublic ? "shared with the community" : "kept private"}
        </p>
      </div>
    </div>
  );
};

export default StoryDisplay;
