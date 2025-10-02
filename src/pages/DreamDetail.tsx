import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Dream } from '../types/dream';
import { useAuth } from '@/hooks/useAuth.ts';
import { ArrowLeft, Trash2, User, Calendar, Globe, Lock, BookOpen, FileText, Sparkles } from 'lucide-react';

const DreamDetail: React.FC = () => {
  const { dreamId } = useParams<{ dreamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    
    if (window.confirm('Are you sure you want to delete this dream? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteDoc(doc(db, 'dreams', dreamId));
        navigate('/my-dreams');
      } catch (error) {
        console.error('Error deleting dream:', error);
        alert('Failed to delete dream. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="text-center relative z-10">
          {/* Custom loading animation */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-600 border-r-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-3 border-4 border-t-purple-600 border-r-pink-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Loading Dream
          </h3>
          <p className="text-gray-600 text-sm">Retrieving your magical story...</p>
        </div>
      </div>
    );
  }

  if (!dream) {
    return null;
  }

  const isOwner = user && user.uid === dream.userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-x-1"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back</span>
        </button>

        {/* Main Dream Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in duration-700">
          {/* Image Section */}
          {dream.generatedImage && (
            <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <img 
                src={dream.generatedImage} 
                alt={dream.title}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
              )}
              
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

              {/* Floating badges */}
              <div className="absolute top-6 right-6 flex gap-2">
                {dream.isPublic ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/90 backdrop-blur-md text-white rounded-full shadow-lg border border-blue-400/30">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-semibold">Public</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 backdrop-blur-md text-white rounded-full shadow-lg border border-gray-600/30">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-semibold">Private</span>
                  </div>
                )}
              </div>

              {/* Title overlay at bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-2xl">
                  {dream.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{dream.userName}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {dream.createdAt.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="p-8 sm:p-12">
            {/* Header if no image */}
            {!dream.generatedImage && (
              <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {dream.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{dream.userName}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {dream.createdAt.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  {dream.isPublic ? (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        <Globe className="w-3 h-3" />
                        <span className="text-xs font-semibold">Public</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs font-semibold">Private</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Delete Button for Owner */}
            {isOwner && (
              <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delete this dream?</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Original Dream Description */}
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Original Dream</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{dream.description}</p>
            </div>

            {/* Generated Story */}
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-100/40 to-purple-100/40 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Dream Story</h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                    {dream.generatedStory}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamDetail;