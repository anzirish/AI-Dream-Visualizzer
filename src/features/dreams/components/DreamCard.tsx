import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Eye, Calendar, User, Sparkles } from 'lucide-react';
import type { Dream } from '../types/dream';

interface DreamCardProps {
  dream: Dream;
  showDelete?: boolean;
  onDelete?: (dreamId: string) => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, showDelete = false, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this dream?')) {
      onDelete(dream.id);
    }
  };

  return (
    <Link to={`/dream/${dream.id}`}>
      <div 
        className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-300 pointer-events-none z-10" />
        
        {/* Image Section */}
        {dream.generatedImage && (
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img 
              src={dream.generatedImage} 
              alt={dream.title}
              className={`w-full h-48 sm:h-56 object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 right-3 flex gap-2 z-20">
              {dream.isPublic && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                  <Eye className="w-3 h-3" />
                  Public
                </span>
              )}
            </div>

            {/* View overlay on hover */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform transition-all duration-300">
                <span className="text-sm font-semibold text-gray-800">View Dream</span>
              </div>
            </div>

            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            )}
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-4 sm:p-6 relative z-20 flex flex-col">
          {/* Header with title and actions */}
          <div className="flex items-start justify-between mb-3 gap-2 sm:gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
              {dream.title}
            </h3>
            
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
          
          {/* Meta information */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs text-gray-500 h-4">
            {dream.userName && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium">{dream.userName}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dream.createdAt.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed h-10">
            {dream.description}
          </p>
          
          {/* Story Section */}
          <div className="relative bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100 shadow-inner overflow-hidden group-hover:shadow-md transition-shadow duration-300 flex-grow flex flex-col">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-blue-200/30 rounded-full blur-2xl -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8" />
            <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-20 sm:h-20 bg-blue-200/30 rounded-full blur-2xl translate-y-4 -translate-x-4 sm:translate-y-6 sm:-translate-x-6" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Dream Story
                </span>
              </div>
              <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed h-16">
                {dream.generatedStory}
              </p>
            </div>
            
            {/* Read more indicator */}
            <div className="absolute bottom-2 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-blue-600 font-medium">Read more →</span>
            </div>
          </div>
        </div>

        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  );
};

export default DreamCard;