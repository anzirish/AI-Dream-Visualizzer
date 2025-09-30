import { generateDreamStory, generateDreamImage } from "@/lib/openrouter.ts";
import type { DreamFormData } from "@/types/dream.ts";
import { useState } from "react";

interface DreamFormProps {
  onStoryGenerated: (story: string, dreamData: DreamFormData, image: string) => void; // <-- Add image
}

const DreamForm: React.FC<DreamFormProps> = ({ onStoryGenerated }) => {
  const [formData, setFormData] = useState<DreamFormData>({
    title: '',
    description: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.title.trim() || !formData.description.trim()) {
    setError('Please fill in both title and description');
    return;
  }

  setIsGenerating(true);
  setError('');

  try {
    // Generate story
     const [story, image] = await Promise.all([
        generateDreamStory(formData.title, formData.description),
        generateDreamImage(formData.description),
      ]);
    
    // ✅ Pass BOTH story and image to parent
    onStoryGenerated(story, formData, image); // <-- Add image parameter

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    setError(error.message || 'Failed to generate story or image');
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Dream Story</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dream Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Give your dream a title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dream Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your dream in detail..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isGenerating ? 'Generating Story & Image...' : 'Generate Dream Story ✨'}
        </button>
      </form>
    </div>
  );
};

export default DreamForm;
