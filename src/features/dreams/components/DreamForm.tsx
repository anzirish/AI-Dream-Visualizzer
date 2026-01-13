import { dreamService } from "../services/dreamService";
import type { DreamFormData } from "../types/dream";
import { useState } from "react";

interface DreamFormProps {
  onStoryGenerated: (story: string, dreamData: DreamFormData, image: string) => void;
}

// Dream creation form component
const DreamForm: React.FC<DreamFormProps> = ({ onStoryGenerated }) => {
  const [formData, setFormData] = useState<DreamFormData>({
    title: '',
    description: '',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'story' | 'image'>('idle');
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
    setGenerationStep('story');

    try {
      setGenerationStep('story');
      const result = await dreamService.generateCompleteDream(formData.title, formData.description);
      
      setGenerationStep('image');
      onStoryGenerated(result.story, formData, result.image || '');
      
      setFormData({ title: '', description: '' });
      setGenerationStep('idle');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || 'Failed to generate story or image');
      setGenerationStep('idle');
    } finally {
      setIsGenerating(false);
    }
  };

  const charCount = formData.description.length;
  const titleCharCount = formData.title.length;

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
            Dream Title ({titleCharCount}/100)
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={100}
            placeholder="e.g., Flying Through Crystal Caves"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dream Description ({charCount}/500)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            maxLength={500}
            placeholder="Describe your dream in detail..."
            rows={6}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Tip: More details create better results!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-gray-800">
                {generationStep === 'story' ? 'Creating story...' : 'Finalizing...'}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-full bg-blue-600 rounded-full transition-all duration-1000 ${
                generationStep === 'story' ? 'w-3/4' : 'w-full'
              }`} />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating || !formData.title.trim() || !formData.description.trim()}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded transition-colors"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            'Generate Dream Story & Image'
          )}
        </button>

        <div className="flex justify-between text-xs text-gray-500 pt-2">
          <span>Free generations may be limited</span>
          <span>Powered by AI</span>
        </div>
      </form>
    </div>
  );
};

export default DreamForm;