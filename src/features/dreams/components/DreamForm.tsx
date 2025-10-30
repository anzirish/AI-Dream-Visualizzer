import { dreamService } from "../services/dreamService";
import type { DreamFormData } from "../types/dream";
import { useState } from "react";
import { Sparkles, Wand2, FileText, AlertCircle } from "lucide-react";


/**
 * DreamForm Component
 *
 * Interactive form for creating dream stories with AI-generated content.
 * Allows users to input dream details and generates both story and image.
 *
 * Features:
 * - Dual input fields for title and description
 * - Character count validation and limits
 * - Real-time form validation
 * - Multi-step AI generation (story then image)
 * - Progress indicators during generation
 * - Error handling with user-friendly messages
 * - Responsive design with visual feedback
 */

interface DreamFormProps {
  /** Callback function called when story and image generation is complete */
  onStoryGenerated: (story: string, dreamData: DreamFormData, image: string) => void;
}

const DreamForm: React.FC<DreamFormProps> = ({ onStoryGenerated }) => {
  // Form state management
  /** User input data for dream title and description */
  const [formData, setFormData] = useState<DreamFormData>({
    title: '',
    description: '',
  });
  
  /** Loading state during AI generation process */
  const [isGenerating, setIsGenerating] = useState(false);
  
  /** Current step in the generation process (idle, story, image) */
  const [generationStep, setGenerationStep] = useState<'idle' | 'story' | 'image'>('idle');
  
  /** Error messages for form validation and generation failures */
  const [error, setError] = useState('');
  


  /**
   * Handles input field changes and clears errors
   * 
   * @param e - React change event from input or textarea
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update form data with new value
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handles form submission and AI generation process
   * 
   * @param e - React form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in both title and description');
      return;
    }

    // Initialize generation process
    setIsGenerating(true);
    setError('');
    setGenerationStep('story');

    try {
      // Generate both story and image in a single API call
      setGenerationStep('story');
      const result = await dreamService.generateCompleteDream(formData.title, formData.description);
      
      // Update to image step for UI feedback
      setGenerationStep('image');
      
      // Pass generated content to parent component
      onStoryGenerated(result.story, formData, result.image || '');
      
      // Reset form to initial state
      setFormData({ title: '', description: '' });
      setGenerationStep('idle');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle generation errors with user-friendly messages
      setError(error.message || 'Failed to generate story or image');
      setGenerationStep('idle');
    } finally {
      // Always reset loading state
      setIsGenerating(false);
    }
  };

  // Character count tracking for validation and UI feedback
  const charCount = formData.description.length;
  const titleCharCount = formData.title.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-200 max-w-4xl mx-auto">
      {/* Form Header Section */}
      <div className="flex items-center gap-3 mb-6">
        {/* Magic wand icon */}
        <div className="p-3 bg-blue-600 rounded-lg">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        {/* Title and description */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create Your Dream Story
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Let AI bring your dreams to life with a story and image
          </p>
        </div>
      </div>
        
        {/* Dream Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dream Title Input Field */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              Dream Title
              {/* Character counter */}
              <span className="text-xs text-gray-500 font-normal ml-auto">
                {titleCharCount}/100
              </span>
            </label>
            {/* Title input with character limit */}
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={100}
              placeholder="e.g., Flying Through Crystal Caves"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Dream Description Textarea Field */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Dream Description
              {/* Character counter */}
              <span className="text-xs text-gray-500 font-normal ml-auto">
                {charCount}/500
              </span>
            </label>
            {/* Multi-line description input with character limit */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={500}
              placeholder="Describe your dream in vivid detail... What did you see? What did you feel? Let your imagination flow..."
              rows={6}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
            {/* Helpful tip for users */}
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Tip: The more details you provide, the more magical the result!
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* AI Generation Progress Indicator */}
          {isGenerating && (
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                {/* Loading spinner */}
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="flex-1">
                  {/* Dynamic status message based on current step */}
                  <p className="text-sm font-semibold text-gray-800">
                    {generationStep === 'story' ? 'Crafting your dream story...' : 'Finalizing dream content...'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {generationStep === 'story' ? 'AI is weaving your narrative and creating visuals' : 'Putting finishing touches on your dream'}
                  </p>
                </div>
              </div>
              {/* Progress bar showing completion status */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-full bg-blue-600 rounded-full transition-all duration-1000 ${
                  generationStep === 'story' ? 'w-3/4' : 'w-full'
                }`} />
              </div>
            </div>
          )}

          {/* Form Submit Button */}
          <button
            type="submit"
            disabled={isGenerating || !formData.title.trim() || !formData.description.trim()}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* Dynamic button content based on generation state */}
            <span className="flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  {/* Loading spinner during generation */}
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Dream Story & Image
                </>
              )}
            </span>
          </button>

          {/* Footer Information */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            {/* Service availability notice */}
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Free generations may be unavailable
            </span>
            {/* AI attribution */}
            <span>Powered by AI</span>
          </div>
        </form>


    </div>
  );
};

export default DreamForm;