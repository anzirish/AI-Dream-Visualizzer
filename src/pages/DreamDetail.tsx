import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Dream } from '../types/dream';
import { useAuth } from '@/hooks/useAuth.ts';

const DreamDetail: React.FC = () => {
  const { dreamId } = useParams<{ dreamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDream = async () => {
      if (!dreamId) return;

      try {
        const dreamDoc = await getDoc(doc(db, 'dreams', dreamId));
        
        if (!dreamDoc.exists()) {
          navigate('/');
          return;
        }

        const data = dreamDoc.data();
        
        // Allow viewing if: dream is public OR user owns the dream
        const canView = data.isPublic || (user && data.userId === user.uid);
        
        if (!canView) {
          alert('This dream is private');
          navigate('/');
          return;
        }

        setDream({
          id: dreamDoc.id,
          userId: data.userId,
          userName: data.userName || 'Anonymous',
          title: data.title,
          description: data.description,
          generatedStory: data.generatedStory,
          generatedImage: data.generatedImage || '',
          isPublic: data.isPublic !== undefined ? data.isPublic : false,
          createdAt: data.createdAt.toDate(),
        });
      } catch (error) {
        console.error('Error fetching dream:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchDream();
  }, [dreamId, user, navigate]);

  const handleDelete = async () => {
    if (!dream || !dreamId) return;
    
    if (window.confirm('Are you sure you want to delete this dream?')) {
      try {
        await deleteDoc(doc(db, 'dreams', dreamId));
        navigate('/my-dreams');
      } catch (error) {
        console.error('Error deleting dream:', error);
        alert('Failed to delete dream. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading dream...</p>
        </div>
      </div>
    );
  }

  if (!dream) {
    return null;
  }

  const isOwner = user && user.uid === dream.userId;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Dream Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Image */}
          {dream.generatedImage && (
            <img 
              src={dream.generatedImage} 
              alt={dream.title}
              className="w-full h-96 object-cover"
            />
          )}

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{dream.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>by {dream.userName}</span>
                  <span>•</span>
                  <span>{dream.createdAt.toLocaleDateString()}</span>
                  {dream.isPublic && (
                    <>
                      <span>•</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        Public
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Delete Button for Owner */}
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              )}
            </div>

            {/* Description */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Original Dream:</h2>
              <p className="text-gray-700">{dream.description}</p>
            </div>

            {/* Generated Story */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dream Story</h2>
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {dream.generatedStory}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamDetail;