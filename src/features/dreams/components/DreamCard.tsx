import React from 'react';
import { Link } from 'react-router-dom';
import type { Dream } from '../types/dream';

interface DreamCardProps {
  dream: Dream;
  showDelete?: boolean;
  onDelete?: (dreamId: string) => void;
}

// Dream card component for displaying dreams
const DreamCard: React.FC<DreamCardProps> = ({ dream, showDelete = false, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDelete && window.confirm('Delete this dream?')) {
      onDelete(dream.id);
    }
  };

  return (
    <Link to={`/dream/${dream.id}`}>
      <div className="bg-white rounded-lg shadow border hover:shadow-lg transition-shadow">
        {/* Dream Image */}
        {dream.generatedImage && (
          <div className="relative">
            <img 
              src={dream.generatedImage} 
              alt={dream.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {dream.isPublic && (
              <span className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                Public
              </span>
            )}
          </div>
        )}
        
        {/* Card Content */}
        <div className="p-4">
          {/* Title and Delete Button */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {dream.title}
            </h3>
            {showDelete && onDelete && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 ml-2"
                title="Delete dream"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
            {dream.userName && <span>{dream.userName}</span>}
            <span>{dream.createdAt.toLocaleDateString()}</span>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {dream.description}
          </p>
          
          {/* Generated Story Preview */}
          <div className="bg-blue-50 rounded p-3 border">
            <div className="text-xs font-medium text-blue-700 mb-1">
              AI Story
            </div>
            <p className="text-sm text-gray-800 line-clamp-3">
              {dream.generatedStory}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DreamCard;