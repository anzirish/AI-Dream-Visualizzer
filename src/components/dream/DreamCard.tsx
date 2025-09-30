import React from 'react';
import { Link } from 'react-router-dom';
import type { Dream } from '../../types/dream';

interface DreamCardProps {
  dream: Dream;
  showDelete?: boolean;
  onDelete?: (dreamId: string) => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, showDelete = false, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete && window.confirm('Are you sure you want to delete this dream?')) {
      onDelete(dream.id);
    }
  };

  return (
    <Link to={`/dream/${dream.id}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        {/* Image */}
        {dream.generatedImage && (
          <div className="relative">
            <img 
              src={dream.generatedImage} 
              alt={dream.title}
              className="w-full h-48 object-cover"
            />
            {dream.isPublic && (
              <span className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                Public
              </span>
            )}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
              {dream.title}
            </h3>
            <div className="flex items-center space-x-2 ml-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {dream.createdAt.toLocaleDateString()}
              </span>
              {showDelete && onDelete && (
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Delete dream"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {dream.userName && (
            <p className="text-sm text-gray-500 mb-2">by {dream.userName}</p>
          )}
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {dream.description}
          </p>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
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