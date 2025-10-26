import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/firebase';
import { Calendar, User, Sparkles, ArrowLeft, Eye } from 'lucide-react';
import type { Dream } from '@/features/dreams/types/dream';

const DreamDetail: React.FC = () => {
  const { dreamId } = useParams<{ dreamId: string }>();
  const navigate = useNavigate();
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDream = async () => {
      if (!dreamId) {
        setError('Dream ID not provided');
        setLoading(false);
        return;
      }

      try {
        const dreamDoc = await getDoc(doc(db, 'dreams', dreamId));
        
        if (dreamDoc.exists()) {
          const dreamData = dreamDoc.data();
          setDream({
            id: dreamDoc.id,
            ...dreamData,
            createdAt: dreamData.createdAt?.toDate() || new Date()
          } as Dream);
        } else {
          setError('Dream not found');
        }
      } catch (err) {
        console.error('Error fetching dream:', err);
        setError('Failed to load dream');
      } finally {
        setLoading(false);
      }
    };

    fetchDream();
  }, [dreamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dream...</p>
        </div>
      </div>
    );
  }

  if (error || !dream) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dream Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The dream you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Dream Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Image Section */}
          {dream.generatedImage && (
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={dream.generatedImage}
                alt={dream.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {dream.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {dream.userName && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>By {dream.userName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{dream.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{dream.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Dream Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {dream.description}
              </p>
            </div>

            {/* Generated Story */}
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 shadow-inner">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-purple-700">AI Generated Story</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                  {dream.generatedStory}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamDetail;