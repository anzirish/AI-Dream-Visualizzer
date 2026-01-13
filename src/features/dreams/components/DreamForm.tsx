import { dreamService } from "../services/dreamService";
import type { DreamFormData } from "../types/dream";
import { useState } from "react";

interface DreamFormProps {
  onStoryGenerated: (story: string, dreamData: DreamFormData, image: string) => void;
}

// Simplified dream creation form
const DreamForm: React.FC<DreamFormProps> = ({ onStoryGenerated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const result = await dreamService.generateCompleteDream(title, description);
      onStoryGenerated(result.story, { title, description }, result.image || '');
      
      // Reset form
      setTitle('');
      setDescription('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Dream Story
        </h2>
        <p className="text-gray-600">
          Let AI bring your dreams to life with a story and image
        </p>
      </div>
        
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dream Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Flying Through Crystal Caves"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dream Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your dream in detail..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate Dream Story & Image'}
        </button>
      </form>
    </div>
  );
};

export default DreamForm;