import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Dream } from '../../types/dream';
import DreamCard from './DreamCard';

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
        // First try to get dreams with isPublic = true
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
        
        setDreams(dreamsData);
        setFilteredDreams(dreamsData);
      } catch (error) {
        console.error('Error fetching public dreams:', error);
        // If there's an error (like missing index), just show empty
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
        dream.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDreams(filtered);
    }
  }, [searchQuery, dreams]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-600">Loading public dreams...</p>
      </div>
    );
  }

  if (filteredDreams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No dreams found' : 'No public dreams yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try a different search term' : 'Be the first to share your dream publicly!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredDreams.map((dream) => (
        <DreamCard key={dream.id} dream={dream} />
      ))}
    </div>
  );
};

export default PublicDreamFeed;