import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { DreamFormData } from '../../types/dream';
import { useAuth } from '@/hooks/useAuth.ts';
import { Save, Sparkles, Lock, Globe, CheckCircle2, AlertCircle, Image as ImageIcon, BookOpen } from 'lucide-react';

interface StoryDisplayProps {
  story: string;
  dreamData: DreamFormData;
  image?: string;
  onReset: () => void;
}

const compressBase64Image = async (
  base64: string,
  maxWidth = 512,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
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
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSave = async () => {
    if (!user) {
      setError('You must be logged in to save dreams');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const compressedImage = image ? await compressBase64Image(image, 512, 0.7) : '';

      const dreamToSave = {
        userId: user.uid,
        userName: user.name,
        title: dreamData.title,
        description: dreamData.description,
        generatedStory: story,
        generatedImage: compressedImage,
        isPublic: isPublic,
        createdAt: new Date(),
      };

      console.log('Saving dream:', dreamToSave);
      await addDoc(collection(db, 'dreams'), dreamToSave);
      
      console.log('Dream saved successfully!');
      setIsSaved(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error saving dream:', error);
      setError(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewDream = () => {
    setIsSaved(false);
    setError('');
    setIsPublic(false);
    setImageLoaded(false);
    onReset();
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl translate-y-32 -translate-x-32 pointer-events-none" />

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Dream Story
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-gray-700">
              Generated from: <span className="font-semibold text-gray-900">"{dreamData.title}"</span>
            </p>
          </div>
        </div>

        {/* Image Section */}
        {image && (
          <div className="mb-8 group">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Dream Visualization</h3>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={image}
                alt="AI Dream Visualization"
                className={`w-full h-auto transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        )}

        {/* Story Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Dream Narrative</h3>
          </div>
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/40 to-purple-100/40 rounded-full blur-2xl" />
            
            <div className="relative prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                {story}
              </p>
            </div>
          </div>
        </div>

        {/* Visibility Settings */}
        {!isSaved && (
          <div className="mb-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-lg hover:border-blue-300 transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Visibility Settings
            </h3>
            <label className="flex items-start sm:items-center cursor-pointer group">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="block w-14 h-8 rounded-full bg-gray-300 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600 transition-all duration-300 shadow-inner"></div>
                <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md peer-checked:translate-x-6 flex items-center justify-center">
                  {isPublic ? (
                    <Globe className="w-3 h-3 text-blue-600" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-600" />
                  )}
                </div>
              </div>
              <div className="ml-4">
                <span className="block text-base font-semibold text-gray-900 mb-1">
                  {isPublic ? 'Public Dream' : 'Private Dream'}
                </span>
                <span className="block text-sm text-gray-600">
                  {isPublic 
                    ? 'Anyone can view and be inspired by your dream' 
                    : 'Only you can see this dream in your collection'}
                </span>
              </div>
            </label>
          </div>
        )}

        {/* Success/Error Messages */}
        {isSaved && (
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl animate-in fade-in duration-500">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-semibold text-green-900 mb-1">Dream Saved Successfully!</p>
                <p className="text-sm text-green-700">
                  Your dream has been saved to your collection and is now {isPublic ? 'visible to everyone' : 'private'}.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-2xl animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-semibold text-red-900 mb-1">Error Saving Dream</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className="group relative flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none overflow-hidden"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            <span className="relative flex items-center justify-center gap-2">
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
            className="group relative flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            <span className="relative flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Create New Dream
            </span>
          </button>
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Your dream will be {isPublic ? 'shared with the community' : 'kept private'} after saving
        </p>
      </div>
    </div>
  );
};

export default StoryDisplay;