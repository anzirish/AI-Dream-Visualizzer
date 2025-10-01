import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { type ApiKeys } from '../types/dream';

let cachedKeys: ApiKeys | null = null;

export const getApiKeys = async (): Promise<ApiKeys> => {
  // Return cached keys if available
  if (cachedKeys) {
    return cachedKeys;
  }

  try {
    const keysDoc = await getDoc(doc(db, 'config', 'apiKeys'));
    
    if (!keysDoc.exists()) {
      throw new Error('API keys not found in Firestore. Please configure them.');
    }

    const data = keysDoc.data();
    cachedKeys = {
      openRouterKey: data.openRouterKey || '',
      stableDiffusionKey: data.stableDiffusionKey || '',
    };

    return cachedKeys;
  } catch (error) {
    console.error('Error fetching API keys:', error);
    throw new Error('Failed to fetch API keys from Firestore');
  }
};

// Clear cache if needed (e.g., when keys are updated)
export const clearApiKeysCache = () => {
  cachedKeys = null;
};