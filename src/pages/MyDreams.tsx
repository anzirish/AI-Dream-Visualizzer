import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Dream } from '../types/dream';
import { Link } from 'react-router-dom';
import DreamCard from '../components/dream/DreamCard';
import { useAuth } from '@/hooks/useAuth.ts';

const MyDreams: React.FC = () => {
  const { user } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDreams = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'dreams'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const dreamsData: Dream[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dreamsData.push({
          id: doc.id,
          userId: data.userId,
          userName: data.userName || user.name,
          title: data.title,
          description: data.description,
          generatedStory: data.generatedStory,
          generatedImage: data.generatedImage || '',
          isPublic: data.isPublic !== undefined ? data.isPublic : false, // Handle old dreams
          createdAt: data.createdAt.toDate(),
        });
      });
      
      setDreams(dreamsData);
    } catch (error) {
      console.error('Error fetching dreams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, [user]);

  const handleDelete = async (dreamId: string) => {
    try {
      await deleteDoc(doc(db, 'dreams', dreamId));
      setDreams(dreams.filter(dream => dream.id !== dreamId));
    } catch (error) {
      console.error('Error deleting dream:', error);
      alert('Failed to delete dream. Please try again.');
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
          <p className="text-gray-600">Loading your dreams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Dream{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Collection
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Revisit the stories born from your dreams
          </p>
        </div>

        {dreams.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No dreams yet</h3>
              <p className="text-gray-600 mb-6">Start creating your first dream story!</p>
              <Link to="/create-dream">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                  Create Your First Dream ✨
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dreams.map((dream) => (
              <DreamCard 
                key={dream.id} 
                dream={dream} 
                showDelete={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {dreams.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/create-dream">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md transition-colors shadow-lg">
                Create Another Dream ✨
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDreams;