import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmXEpWtcdIH7Wm-ODegtduLoLw1E5U3sk",
  authDomain: "ai-dream-77521.firebaseapp.com",
  projectId: "ai-dream-77521",
  storageBucket: "ai-dream-77521.firebasestorage.app",
  messagingSenderId: "269827292455",
  appId: "1:269827292455:web:08386cee7adbc63576bd02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Set persistence to local storage for faster subsequent loads
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error);
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;