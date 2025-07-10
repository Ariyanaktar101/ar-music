'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { Song } from '@/lib/types';
import { getLyrics } from '@/ai/flows/get-lyrics-flow';

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  progress: number;
  duration: number;
  handleProgressChange: (value: number[]) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  volume: number;
  isMuted: boolean;
  handleVolumeChange: (value: number[]) => void;
  handleMuteToggle: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  closePlayer: () => void;
  favoriteSongs: string[];
  isFavorite: (songId: string) => boolean;
  toggleFavorite: (songId: string) => void;
  isExpanded: boolean;
  toggleExpandPlayer: () => void;
  showLyrics: boolean;
  lyrics: string | null;
  loadingLyrics: boolean;
  toggleLyricsView: () => void;
  currentLineIndex: number | null;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Lyrics State
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const setAudioTime = () => {
      setProgress(audio.currentTime);

      if (lyrics && duration > 0) {
        const lines = lyrics.split('\n');
        const numLines = lines.length;
        const lineDuration = duration / numLines;
        const currentLine = Math.floor(audio.currentTime / lineDuration);
        setCurrentLineIndex(currentLine);
      }
    };
    const handleSongEnd = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleSongEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [currentSong, lyrics, duration]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const playSong = (song: Song) => {
    if (currentSong?.id === song.id) {
        togglePlayPause();
        return;
    }
    setCurrentSong(song);
    setIsPlaying(true);
    // Reset lyrics view when song changes
    setShowLyrics(false);
    setLyrics(null);
    setCurrentLineIndex(null);
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }
  };

  const togglePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    setIsMuted(newVolume === 0);
  };
  
  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
    }
    if (!newMutedState && volume === 0) {
      setVolume(50); // Unmute to a default volume
       if (audioRef.current) {
        audioRef.current.volume = 0.5;
      }
    }
  };
  
  const skipForward = () => {
      if(audioRef.current) audioRef.current.currentTime += 10;
  };

  const skipBackward = () => {
      if(audioRef.current) audioRef.current.currentTime -= 10;
  };

  const closePlayer = () => {
      setCurrentSong(null);
      setIsPlaying(false);
      setIsExpanded(false);
  }

  const isFavorite = (songId: string) => {
    return favoriteSongs.includes(songId);
  }

  const toggleFavorite = (songId: string) => {
    setFavoriteSongs(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    )
  }

  const toggleExpandPlayer = () => {
    setIsExpanded(prev => !prev);
    // Close lyrics view when player is collapsed
    if (isExpanded) {
      setShowLyrics(false);
    }
  }

  const fetchLyrics = useCallback(async () => {
    if (!currentSong) return;
    setLoadingLyrics(true);
    setLyrics(null);
    setCurrentLineIndex(null);
    try {
        const result = await getLyrics({ songTitle: currentSong.title, artist: currentSong.artist });
        setLyrics(result.lyrics || null);
    } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        setLyrics(null);
    } finally {
        setLoadingLyrics(false);
    }
  }, [currentSong]);

  const toggleLyricsView = () => {
      const willShow = !showLyrics;
      setShowLyrics(willShow);
      if(willShow && !lyrics && !loadingLyrics) {
          fetchLyrics();
      }
  }


  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        togglePlayPause,
        progress,
        duration,
        handleProgressChange,
        audioRef,
        volume,
        isMuted,
        handleVolumeChange,
        handleMuteToggle,
        skipForward,
        skipBackward,
        closePlayer,
        favoriteSongs,
        isFavorite,
        toggleFavorite,
        isExpanded,
        toggleExpandPlayer,
        showLyrics,
        lyrics,
        loadingLyrics,
        toggleLyricsView,
        currentLineIndex,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
