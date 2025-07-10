'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type StreamingQuality = 'low' | 'normal' | 'high' | 'lossless';

interface SettingsContextType {
  streamingQuality: StreamingQuality;
  setStreamingQuality: (quality: StreamingQuality) => void;
  crossfade: number;
  setCrossfade: (duration: number) => void;
  downloadOverWifiOnly: boolean;
  setDownloadOverWifiOnly: (enabled: boolean) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ar-music-settings';

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [streamingQuality, setStreamingQuality] = useState<StreamingQuality>('normal');
  const [crossfade, setCrossfade] = useState(8);
  const [downloadOverWifiOnly, setDownloadOverWifiOnly] = useState(true);
  const [accentColor, setAccentColor] = useState('207 90% 58%'); // Default blue
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setStreamingQuality(parsedSettings.streamingQuality || 'normal');
        setCrossfade(parsedSettings.crossfade || 8);
        setDownloadOverWifiOnly(parsedSettings.downloadOverWifiOnly === true);
        setAccentColor(parsedSettings.accentColor || '207 90% 58%');
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const settingsToStore = {
        streamingQuality,
        crossfade,
        downloadOverWifiOnly,
        accentColor,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settingsToStore));
    }
  }, [streamingQuality, crossfade, downloadOverWifiOnly, accentColor, isLoaded]);

  if (!isLoaded) {
    return null;
  }
  
  return (
    <SettingsContext.Provider
      value={{
        streamingQuality,
        setStreamingQuality,
        crossfade,
        setCrossfade,
        downloadOverWifiOnly,
        setDownloadOverWifiOnly,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
