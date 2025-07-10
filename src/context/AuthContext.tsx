'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email?: string;
  phone?: string;
  avatarSeed?: string;
  username?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ar-music-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    const userToSave = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatarSeed: userData.avatarSeed || userData.name, // use name as seed if not provided
        username: userData.username,
        bio: userData.bio,
    }
    setUser(userToSave);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userToSave));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };
  
  // Don't render children until we've checked for a user in localStorage
  if (loading) {
      return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
