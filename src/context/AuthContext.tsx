
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';

interface User {
  name: string;
  email?: string;
  phone?: string;
  avatarSeed?: string;
  avatarUrl?: string; // For custom uploaded avatars or from Google
  username?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ar-music-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        let appUser: User;
        if (storedUser) {
            appUser = JSON.parse(storedUser);
            // Ensure Firebase data (like photoURL) is up-to-date
            appUser.name = firebaseUser.displayName || appUser.name;
            appUser.email = firebaseUser.email || appUser.email;
            appUser.avatarUrl = firebaseUser.photoURL || appUser.avatarUrl;
        } else {
            // New Firebase user, create a profile
            appUser = {
                name: firebaseUser.displayName || 'New User',
                email: firebaseUser.email || '',
                avatarUrl: firebaseUser.photoURL || undefined,
            };
        }
        setUser(appUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appUser));
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData: User) => {
    const userToSave = {
        ...userData,
        avatarSeed: userData.avatarSeed || userData.name, // use name as seed if not provided
    }
    setUser(userToSave);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userToSave));
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const appUser: User = {
        name: firebaseUser.displayName || 'Friend',
        email: firebaseUser.email || '',
        avatarUrl: firebaseUser.photoURL || undefined,
      };
      login(appUser);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      // Handle errors here, e.g., show a toast message
    }
  };

  const logout = async () => {
    try {
        await signOut(auth);
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
        console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
