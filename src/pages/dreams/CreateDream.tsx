import React, { useState } from 'react';
import { DreamForm, StoryDisplay } from '@/features/dreams';
import type { DreamFormData } from '@/features/dreams';

// CreateDream Page Component - Main page for creating new dream stories using AI generation
const CreateDream: React.FC = () => {
  // State management for the dream creation workflow
  // AI-generated story content, null when not yet generated
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  
  // AI-generated image URL
  const [generatedImage, setGeneratedImage] = useState<string>('');
  
  // Original form data from user input
  const [dreamData, setDreamData] = useState<DreamFormData | null>(null);

  // Handles successful story generation from DreamForm
  // Transitions from form view to story display view
  const handleStoryGenerated = (story: string, formData: DreamFormData, image: string) => {
    setGeneratedStory(story);
    setGeneratedImage(image);
    setDreamData(formData);
  };

  // Resets the creation workflow back to the initial form state
  // Allows users to start over with a new dream
  const handleReset = () => {
    setGeneratedStory(null);
    setGeneratedImage('');
    setDreamData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your{' '}
            <span className="text-blue-600">
              Dreams
            </span>{' '}
            Into Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your dream with AI and watch it transform into a beautiful, creative story
          </p>
        </div>

        {/* Main Content Area - Conditional rendering based on workflow state */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {!generatedStory ? (
            /* Phase 1: Dream Input Form */
            <DreamForm onStoryGenerated={handleStoryGenerated} />
          ) : (
            /* Phase 2: Generated Story Display and Editing */
            dreamData && (
              <StoryDisplay 
                story={generatedStory}
                dreamData={dreamData}
                image={generatedImage}
                onReset={handleReset}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDream;