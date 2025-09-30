import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { DreamFormData } from '@/types/dream.ts';
import { useAuth } from '@/hooks/useAuth.ts';

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
    onReset();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-blue-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Dream Story ✨</h2>
        <p className="text-gray-600">Generated from: "{dreamData.title}"</p>
      </div>

      {/* Image */}
      {image && (
        <div className="mb-6 flex justify-center">
          <img
            src={image}
            alt="AI Dream"
            className="rounded-lg shadow-md max-w-full h-auto border border-gray-300"
          />
        </div>
      )}

      {/* Story */}
      <div className="bg-white rounded-lg p-6 shadow-inner mb-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {story}
          </p>
        </div>
      </div>

      {/* Public/Private Toggle */}
      {!isSaved && (
        <div className="mb-4 flex items-center justify-center space-x-3 p-4 bg-white rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700 font-medium">
              Make this dream public 🌐
            </span>
          </label>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {isSaving ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : isSaved ? (
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Saved!
            </div>
          ) : (
            'Save Dream 💾'
          )}
        </button>

        <button
          onClick={handleNewDream}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create New Dream ✨
        </button>
      </div>
    </div>
  );
};

export default StoryDisplay;