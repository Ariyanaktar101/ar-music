
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
  recentlyPlayed: Song[];
  isExpanded: boolean;
  toggleExpandPlayer: () => void;
  showLyrics: boolean;
  lyrics: string | null;
  loadingLyrics: boolean;
  toggleLyricsView: () => void;
  currentLineIndex: number | null;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

// A data structure to hold pre-calculated timings for each lyric line
interface LyricTimings {
  line: string;
  startTime: number;
}

export const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Lyrics State
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);
  const [lyricTimings, setLyricTimings] = useState<LyricTimings[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('ar-music-favorites');
      if (storedFavorites) {
        setFavoriteSongs(JSON.parse(storedFavorites));
      }
      const storedRecent = localStorage.getItem('ar-music-recent');
      if (storedRecent) {
        setRecentlyPlayed(JSON.parse(storedRecent));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ar-music-favorites', JSON.stringify(favoriteSongs));
  }, [favoriteSongs]);

  useEffect(() => {
    localStorage.setItem('ar-music-recent', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);
  
  // Effect to pre-calculate lyric timings when lyrics or duration are set
  useEffect(() => {
    if (lyrics && duration > 0) {
      const lines = lyrics.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) {
        setLyricTimings([]);
        return;
      }
      
      const totalChars = lines.reduce((acc, line) => acc + line.length, 0);
      const effectiveDuration = duration - 3; // Start lyrics a bit later
      let currentTime = 1.5; // Start time for the first lyric

      const timings = lines.map(line => {
        const lineDuration = (line.length / totalChars) * effectiveDuration;
        const startTime = currentTime;
        currentTime += lineDuration;
        return { line, startTime };
      });

      setLyricTimings(timings);
    } else {
       setLyricTimings([]);
    }
  }, [lyrics, duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const setAudioTime = () => {
      const currentTime = audio.currentTime;
      setProgress(currentTime);

      if (isPlaying && lyricTimings.length > 0) {
        // Find the current line by checking start times
        let newIndex = lyricTimings.findIndex((timing, index) => {
            const nextTiming = lyricTimings[index + 1];
            return currentTime >= timing.startTime && (!nextTiming || currentTime < nextTiming.startTime);
        });

        if (newIndex !== -1 && newIndex !== currentLineIndex) {
            setCurrentLineIndex(newIndex);
        }
      }
    };
    const handleSongEnd = () => {
      setIsPlaying(false);
      // Highlight the last line when the song ends
      if (lyricTimings.length > 0) {
        setCurrentLineIndex(lyricTimings.length - 1);
      }
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleSongEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [currentSong, isPlaying, lyricTimings, currentLineIndex]);

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

  const addSongToRecents = (song: Song) => {
    setRecentlyPlayed(prev => {
        // Remove the song if it already exists to move it to the top
        const filtered = prev.filter(s => s.id !== song.id);
        // Add the new song to the beginning of the array
        const newRecents = [song, ...filtered];
        // Limit to 20 recent songs
        return newRecents.slice(0, 20);
    });
  }

  const playSong = (song: Song) => {
    if (currentSong?.id === song.id) {
        togglePlayPause();
        return;
    }
    setCurrentSong(song);
    addSongToRecents(song);
    setIsPlaying(true);
    // Reset lyrics view when song changes
    setShowLyrics(false);
    setLyrics(null);
    setCurrentLineIndex(null);
    setLyricTimings([]);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
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
  };

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
        recentlyPlayed,
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
