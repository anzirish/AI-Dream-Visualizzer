import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Eye, Calendar, User, Sparkles } from 'lucide-react';
import type { Dream } from '../types/dream';

/**
 * DreamCard Component
 *
 * Interactive card component for displaying dream entries in lists and feeds.
 * Shows dream metadata, generated image, and story preview with hover effects.
 *
 * Features:
 * - Responsive card layout with hover animations
 * - Generated image display with loading states
 * - Dream metadata (author, date, visibility)
 * - Story preview with truncation
 * - Optional delete functionality for owned dreams
 * - Public/private visibility indicators
 * - Smooth transitions and visual feedback
 * - Click-through navigation to dream detail page
 */

interface DreamCardProps {
  /** Dream data to display */
  dream: Dream;
  /** Whether to show delete button (for user's own dreams) */
  showDelete?: boolean;
  /** Callback function when delete button is clicked */
  onDelete?: (dreamId: string) => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, showDelete = false, onDelete }) => {
  // Component state for UI interactions
  /** Tracks if the dream image has finished loading */
  const [imageLoaded, setImageLoaded] = useState(false);
  
  /** Tracks hover state for interactive effects */
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handles dream deletion with confirmation
   * Prevents event bubbling to avoid navigation
   * 
   * @param e - Mouse click event
   */
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show confirmation dialog before deletion
    if (onDelete && window.confirm('Are you sure you want to delete this dream?')) {
      onDelete(dream.id);
    }
  };

  return (
    <Link to={`/dream/${dream.id}`}>
      {/* Main Card Container with hover effects */}
      <div 
        className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {/* Generated Image Section */}
        {dream.generatedImage && (
          <div className="relative overflow-hidden bg-gray-100">
            {/* Main dream image with loading animation */}
            <img 
              src={dream.generatedImage} 
              alt={dream.title}
              className={`w-full h-48 sm:h-56 object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Status Badges */}
            <div className="absolute top-3 right-3 flex gap-2 z-20">
              {dream.isPublic && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg">
                  <Eye className="w-3 h-3" />
                  Public
                </span>
              )}
            </div>

            {/* Hover Overlay with Call-to-Action */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform transition-all duration-300">
                <span className="text-sm font-semibold text-gray-800">View Dream</span>
              </div>
            </div>

            {/* Image Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>
        )}
        
        {/* Card Content Section */}
        <div className="p-4 sm:p-6 relative z-20 flex flex-col">
          {/* Header with Dream Title and Actions */}
          <div className="flex items-start justify-between mb-3 gap-2 sm:gap-3">
            {/* Dream title with hover effect */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 truncate group-hover:text-blue-600 transition-colors duration-300">
              {dream.title}
            </h3>
            
            {/* Action buttons (delete if owned) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {showDelete && onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  title="Delete dream"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Dream Metadata */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs text-gray-500 h-4">
            {/* Author name (if available) */}
            {dream.userName && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium">{dream.userName}</span>
              </div>
            )}
            {/* Creation date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dream.createdAt.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
          
          {/* Dream Description Preview */}
          <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed h-10">
            {dream.description}
          </p>
          
          {/* AI-Generated Story Preview Section */}
          <div className="relative bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100 shadow-inner overflow-hidden group-hover:shadow-md transition-shadow duration-300 flex-grow flex flex-col">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-blue-200/30 rounded-full blur-2xl -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8" />
            <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-20 sm:h-20 bg-blue-200/30 rounded-full blur-2xl translate-y-4 -translate-x-4 sm:translate-y-6 sm:-translate-x-6" />
            
            {/* Story content */}
            <div className="relative z-10">
              {/* Story section header */}
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Dream Story
                </span>
              </div>
              {/* Truncated story preview */}
              <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed h-16">
                {dream.generatedStory}
              </p>
            </div>
            
            {/* Read More Indicator (appears on hover) */}
            <div className="absolute bottom-2 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-blue-600 font-medium">Read more →</span>
            </div>
          </div>
        </div>


      </div>
    </Link>
  );
};

export default DreamCard;