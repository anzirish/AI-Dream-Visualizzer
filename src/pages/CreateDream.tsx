import DreamForm from "@/components/dream/DreamForm.tsx";
import StoryDisplay from "@/components/dream/StoryDisplay.tsx";
import type { DreamFormData } from "@/types/dream.ts";
import { useState } from "react";

const CreateDream: React.FC = () => {
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [dreamData, setDreamData] = useState<DreamFormData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleStoryGenerated = (story: string, formData: DreamFormData, image : string) => {
    setGeneratedStory(story);
    setDreamData(formData);
    setGeneratedImage(image)
  };

  const handleReset = () => {
    setGeneratedStory(null);
    setDreamData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Dreams
            </span>{' '}
            Into Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your dream with AI and watch it transform into a beautiful, creative story
          </p>
        </div>

        <div className="space-y-8">
          {!generatedStory || !generatedImage ? (
            <DreamForm onStoryGenerated={handleStoryGenerated} />
          ) : (
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

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="font-bold text-blue-600">1.</span>
              <span>Enter your dream title and description</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-bold text-blue-600">2.</span>
              <span>AI transforms it into a creative story</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-bold text-blue-600">3.</span>
              <span>Save your story or create another dream</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDream;