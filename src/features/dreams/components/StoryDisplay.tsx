import React, { useState } from 'react';
import type { DreamFormData } from '../types/dream';
import { useAuth } from '@/features/auth';
import { Save, Sparkles, Lock, Globe, CheckCircle2, AlertCircle, Image as ImageIcon, BookOpen } from 'lucide-react';
import { dreamService } from '../services/dreamService';

/**
 * StoryDisplay Component
 *
 * Displays AI-generated dream story and image with save functionality.
 * Provides privacy controls and responsive layout for optimal viewing.
 *
 * Features:
 * - Responsive layout (mobile/desktop optimized)
 * - AI-generated story and image display
 * - Privacy controls (public/private toggle)
 * - Save functionality with loading states
 * - Image compression for optimal storage
 * - Success/error feedback messages
 * - Reset functionality to create new dreams
 * - Authentication-aware save operations
 */

interface StoryDisplayProps {
  /** AI-generated story content */
  story: string;
  /** Original dream form data */
  dreamData: DreamFormData;
  /** AI-generated image (optional) */
  image?: string;
  /** Callback to reset and create new dream */
  onReset: () => void;
}

/**
 * Compresses a base64 image to reduce file size for storage
 * 
 * @param base64 - Base64 encoded image string
 * @param maxWidth - Maximum width for the compressed image
 * @param quality - JPEG compression quality (0-1)
 * @returns Promise resolving to compressed base64 string
 */
const compressBase64Image = async (
  base64: string,
  maxWidth = 512,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    
    img.onload = () => {
      // Create canvas for image manipulation
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // Draw and compress image
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not found");
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedBase64);
    };
    
    img.onerror = reject;
  });
};

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, dreamData, image, onReset }) => {
  // Authentication context
  const { user } = useAuth();
  
  // Component state management
  /** Loading state during save operation */
  const [isSaving, setIsSaving] = useState(false);
  
  /** Success state after successful save */
  const [isSaved, setIsSaved] = useState(false);
  
  /** Error message for save failures */
  const [error, setError] = useState('');
  
  /** Privacy setting - whether dream should be public */
  const [isPublic, setIsPublic] = useState(false);
  
  /** Image loading state for UI feedback */
  const [imageLoaded, setImageLoaded] = useState(false);

  /**
   * Handles saving the dream to the backend with compression and privacy settings
   */
  const handleSave = async () => {
    // Ensure user is authenticated
    if (!user) {
      setError('You must be logged in to save dreams');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Compress image if present to reduce storage size
      const compressedImage = image ? await compressBase64Image(image, 512, 0.7) : '';

      // Prepare dream data for saving
      const dreamToSave = {
        title: dreamData.title,
        description: dreamData.description,
        generatedStory: story,
        generatedImage: compressedImage,
        isPublic: isPublic,
      };

      // Save dream via service
      await dreamService.createDream(dreamToSave);
      setIsSaved(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error saving dream:', error);
      setError(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Resets component state and triggers parent reset to create new dream
   */
  const handleNewDream = () => {
    setIsSaved(false);
    setError('');
    setIsPublic(false);
    setImageLoaded(false);
    onReset();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-blue-50 border-b border-blue-200 p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Dream Story
          </h2>
          <p className="text-gray-600">
            Generated from: <span className="font-semibold text-gray-900">"{dreamData.title}"</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-6">
          {/* Image Section - Mobile */}
          {image && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Dream Visualization</h3>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200 bg-gray-100">
                <img
                  src={image}
                  alt="AI Dream Visualization"
                  className={`w-full h-auto transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
              </div>
            </div>
          )}

          {/* Story Section - Mobile */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Dream Narrative</h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {story}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex gap-8 min-h-[400px]">
            {/* Left Side - Image */}
            {image && (
              <div className="w-1/2">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Dream Visualization</h3>
                </div>
                <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200 bg-gray-100 h-full">
                  <img
                    src={image}
                    alt="AI Dream Visualization"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                </div>
              </div>
            )}

            {/* Right Side - Story */}
            <div className={`${image ? 'w-1/2' : 'w-full'}`}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Dream Narrative</h3>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 h-full">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {story}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Toggle */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Privacy Settings</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Private (only you can see)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Public (visible to everyone)</span>
            </label>
          </div>
        </div>

        {/* Success/Error Messages */}
        {isSaved && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900 mb-1">Dream Saved Successfully!</p>
                <p className="text-sm text-green-700">
                  Your dream has been saved to your collection and is now {isPublic ? 'visible to everyone' : 'private'}.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">Error Saving Dream</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <span className="flex items-center justify-center gap-2">
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Dream...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Dream
                </>
              )}
            </span>
          </button>

          <button
            onClick={handleNewDream}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Create New Dream
            </span>
          </button>
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Your dream will be {isPublic ? 'shared with the community' : 'kept private'} after saving
        </p>
      </div>
    </div>
  );
};

export default StoryDisplay;