import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/services/firebase/firebase';
import type { Dream } from '../types/dream';
import DreamCard from './DreamCard';
import { Search, Sparkles, Cloud, TrendingUp } from 'lucide-react';

interface PublicDreamFeedProps {
  searchQuery?: string;
}

const PublicDreamFeed: React.FC<PublicDreamFeedProps> = ({ searchQuery = '' }) => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);

  useEffect(() => {
    const fetchPublicDreams = async () => {
      try {
        console.log('Fetching public dreams...'); // Debug
        
        const q = query(
          collection(db, 'dreams'),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        const querySnapshot = await getDocs(q);
        const dreamsData: Dream[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Found public dream:', data.title); // Debug
          dreamsData.push({
            id: doc.id,
            userId: data.userId,
            userName: data.userName || 'Anonymous',
            title: data.title,
            description: data.description,
            generatedStory: data.generatedStory,
            generatedImage: data.generatedImage || '',
            isPublic: data.isPublic,
            createdAt: data.createdAt.toDate(),
          });
        });
        
        console.log('Total public dreams found:', dreamsData.length); // Debug
        setDreams(dreamsData);
        setFilteredDreams(dreamsData);
      } catch (error) {
        console.error('Error fetching public dreams:', error);
        setDreams([]);
        setFilteredDreams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicDreams();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDreams(dreams);
    } else {
      const filtered = dreams.filter(dream =>
        dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDreams(filtered);
    }
  }, [searchQuery, dreams]);

  if (loading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Custom loading animation */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-600 border-r-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-3 border-4 border-t-purple-600 border-r-pink-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            <Cloud className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          
          <h3 className="text-xl font-bold text-blue-600 mb-2">
            Loading Dreams
          </h3>
          <p className="text-gray-600 text-sm">Gathering magical stories from the community...</p>
          
          {/* Loading dots */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredDreams.length === 0) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center py-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-purple-100/50 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-lg mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-gray-200">
            {searchQuery ? (
              <>
                {/* Search not found state */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full"></div>
                  <Search className="absolute inset-0 m-auto w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Dreams Found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any dreams matching <span className="font-semibold text-gray-800">"{searchQuery}"</span>
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Try a different search term or browse all dreams
                </div>
              </>
            ) : (
              <>
                {/* Empty state */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 bg-white rounded-full"></div>
                  <Cloud className="absolute inset-0 m-auto w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Public Dreams Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  The dream gallery is waiting for its first story. Be a pioneer and share your magical dream with the world!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    <Sparkles className="w-5 h-5" />
                    Create Your Dream
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Community Dreams
              </h3>
              <p className="text-sm text-gray-600">
                {filteredDreams.length} {filteredDreams.length === 1 ? 'dream' : 'dreams'} 
                {searchQuery && ' found'}
              </p>
            </div>
          </div>
          
          {searchQuery && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">
                Searching: <span className="font-semibold text-gray-900">{searchQuery}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dream Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:gap-6">
        {filteredDreams.map((dream, index) => (
          <div
            key={dream.id}
            className="animate-in fade-in duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <DreamCard dream={dream} />
          </div>
        ))}
      </div>

      {/* Show more indicator if at limit */}
      {dreams.length >= 50 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-gray-700">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Showing the 50 most recent dreams
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicDreamFeed;