import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { User, AuthContextType } from "../types/auth";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: userData.name,
              createdAt: userData.createdAt.toDate(),
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create user document in Firestore
    const userData = {
      name,
      email,
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userData);

    setUser({
      uid: firebaseUser.uid,
      email,
      name,
      createdAt: new Date(),
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
