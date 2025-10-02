import { generateDreamStory, generateDreamImage } from "@/lib/openrouter.ts";
import type { DreamFormData } from "@/types/dream.ts";
import { useState } from "react";
import { Sparkles, Wand2, Image as ImageIcon, FileText, AlertCircle } from "lucide-react";

interface DreamFormProps {
  onStoryGenerated: (story: string, dreamData: DreamFormData, image: string) => void;
}

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
      // Generate story first
      const story = await generateDreamStory(formData.title, formData.description);
      
      // Then generate image
      setGenerationStep('image');
      const image = await generateDreamImage(formData.description);
      
      // Pass both to parent
      onStoryGenerated(story, formData, image);
      
      // Reset form
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
    <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl p-8 border border-gray-200 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl translate-y-24 -translate-x-24 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Dream Story
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Let AI bring your dreams to life with a story and image
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              Dream Title
              <span className="text-xs text-gray-500 font-normal ml-auto">
                {titleCharCount}/100
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={100}
                placeholder="e.g., Flying Through Crystal Caves"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/5 group-focus-within:to-purple-500/5 transition-all duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Dream Description
              <span className="text-xs text-gray-500 font-normal ml-auto">
                {charCount}/500
              </span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={500}
                placeholder="Describe your dream in vivid detail... What did you see? What did you feel? Let your imagination flow..."
                rows={6}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none group-hover:border-gray-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/5 group-focus-within:to-purple-500/5 transition-all duration-300 pointer-events-none" />
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Tip: The more details you provide, the more magical the result!
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {generationStep === 'story' ? (
                      <FileText className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {generationStep === 'story' ? 'Crafting your dream story...' : 'Generating dream image...'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {generationStep === 'story' ? 'AI is weaving your narrative' : 'AI is painting your vision'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ${
                  generationStep === 'story' ? 'w-1/2' : 'w-full'
                }`} />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating || !formData.title.trim() || !formData.description.trim()}
            className="group relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none overflow-hidden"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            <span className="relative flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
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

          {/* Character count hints */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Free generations available
            </span>
            <span>Powered by AI</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DreamForm;