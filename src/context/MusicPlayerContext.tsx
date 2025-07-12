
'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { Song, Playlist } from '@/lib/types';
import { getLyrics } from '@/ai/flows/get-lyrics-flow';
import { useToast } from '@/hooks/use-toast';

interface MusicPlayerContextType {
  loading: boolean;
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, queue?: Song[]) => void;
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
  
  // Shuffle State
  isShuffled: boolean;
  toggleShuffle: () => void;
  
  // Lyrics State
  showLyrics: boolean;
  lyrics: string | null;
  loadingLyrics: boolean;
  toggleLyricsView: () => void;
  currentLineIndex: number | null;
  
  // Playlist state
  playlists: Playlist[];
  createPlaylist: (name: string, description?: string) => Playlist;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  getPlaylistById: (id: string) => Playlist | undefined;

  // Download state
  downloadedSongs: Song[];
  downloadSong: (song: Song) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

// A data structure to hold pre-calculated timings for each lyric line
interface LyricTimings {
  line: string;
  startTime: number;
}

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


export const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentQueue, setCurrentQueue] = useState<Song[]>([]);
  const [shuffledQueue, setShuffledQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  
  // Lyrics State
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);
  const [lyricTimings, setLyricTimings] = useState<LyricTimings[]>([]);

  // Playlist State
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  // Download State
  const [downloadedSongs, setDownloadedSongs] = useState<Song[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const { toast } = useToast();
  
  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('ar-music-favorites');
      if (storedFavorites) setFavoriteSongs(JSON.parse(storedFavorites));
      
      const storedRecent = localStorage.getItem('ar-music-recent');
      if (storedRecent) setRecentlyPlayed(JSON.parse(storedRecent));

      const storedPlaylists = localStorage.getItem('ar-music-playlists');
      if (storedPlaylists) setPlaylists(JSON.parse(storedPlaylists));

      const storedDownloads = localStorage.getItem('ar-music-downloads');
      if (storedDownloads) setDownloadedSongs(JSON.parse(storedDownloads));

      const storedShuffle = localStorage.getItem('ar-music-shuffle');
      if (storedShuffle) setIsShuffled(JSON.parse(storedShuffle));
      
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (loading) return;
    localStorage.setItem('ar-music-favorites', JSON.stringify(favoriteSongs));
  }, [favoriteSongs, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem('ar-music-recent', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem('ar-music-playlists', JSON.stringify(playlists));
  }, [playlists, loading]);
  
  useEffect(() => {
    if (loading) return;
    localStorage.setItem('ar-music-shuffle', JSON.stringify(isShuffled));
  }, [isShuffled, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem('ar-music-downloads', JSON.stringify(downloadedSongs));
  }, [downloadedSongs, loading]);
  
  const addSongToRecents = useCallback((song: Song) => {
    setRecentlyPlayed(prev => {
        const filtered = prev.filter(s => s.id !== song.id);
        const newRecents = [song, ...filtered];
        return newRecents.slice(0, 20);
    });
  }, []);

  const togglePlayPause = useCallback(() => {
    if (currentSong) {
      setIsPlaying(p => !p);
    }
  }, [currentSong]);

  const playSong = useCallback((song: Song, queue: Song[] = []) => {
    if (currentSong?.id === song.id && isPlaying) {
      togglePlayPause();
      return;
    }
    
    const newQueue = queue.length > 0 ? queue : [song];
    setCurrentQueue(newQueue);
    
    if (isShuffled) {
      const otherSongs = newQueue.filter(s => s.id !== song.id);
      setShuffledQueue([song, ...shuffleArray(otherSongs)]);
    }

    setCurrentSong(song);
    addSongToRecents(song);
    setIsPlaying(true);
    setShowLyrics(false);
    setLyrics(null);
    setCurrentLineIndex(null);
    setLyricTimings([]);
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }
  }, [currentSong, addSongToRecents, isPlaying, isShuffled, togglePlayPause]);

  const playNextSong = useCallback(() => {
    if (!currentSong) return;

    const queue = isShuffled ? shuffledQueue : currentQueue;
    if (queue.length === 0) return;

    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    let nextIndex = (currentIndex + 1);

    if (nextIndex >= queue.length) {
      if(isShuffled) {
        const newShuffledQueue = shuffleArray(currentQueue);
        setShuffledQueue(newShuffledQueue);
        if (newShuffledQueue.length > 0) {
          playSong(newShuffledQueue[0], currentQueue);
        }
        return;
      }
      nextIndex = 0; // Loop for non-shuffled queue
    }
    
    const nextSong = queue[nextIndex];
    
    if (nextSong) {
      playSong(nextSong, currentQueue);
    } else {
      setIsPlaying(false);
    }
  }, [currentSong, currentQueue, shuffledQueue, isShuffled, playSong]);
  
  useEffect(() => {
    if (lyrics && duration > 0) {
      const lines = lyrics.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) {
        setLyricTimings([]);
        return;
      }
      
      const totalChars = lines.reduce((acc, line) => acc + line.length, 0);
      const effectiveDuration = duration - 3; 
      let currentTime = 1.5; 

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
        playNextSong();
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleSongEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [isPlaying, lyricTimings, currentLineIndex, playNextSong]);

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
  
  const toggleShuffle = useCallback(() => {
    const willBeShuffled = !isShuffled;
    setIsShuffled(willBeShuffled);
    if (willBeShuffled && currentSong) {
      const otherSongs = currentQueue.filter(s => s.id !== currentSong.id);
      setShuffledQueue([currentSong, ...shuffleArray(otherSongs)]);
    } else {
      setShuffledQueue([]);
    }
  }, [isShuffled, currentSong, currentQueue]);

  const handleProgressChange = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);
  
  const handleMuteToggle = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (!newMutedState && volume === 0) {
      setVolume(50);
    }
  }, [isMuted, volume]);
  
  const skipForward = useCallback(() => {
    playNextSong();
  }, [playNextSong]);

  const skipBackward = useCallback(() => {
    if (!currentSong) return;
    const queue = isShuffled ? shuffledQueue : currentQueue;
    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      playSong(queue[prevIndex], currentQueue);
    }
  }, [currentSong, currentQueue, shuffledQueue, isShuffled, playSong]);


  const closePlayer = useCallback(() => {
      setCurrentSong(null);
      setIsPlaying(false);
      setIsExpanded(false);
  }, []);

  const isFavorite = useCallback((songId: string) => {
    return favoriteSongs.includes(songId);
  }, [favoriteSongs]);

  const toggleFavorite = useCallback((songId: string) => {
    setFavoriteSongs(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    )
  }, []);

  const toggleExpandPlayer = useCallback(() => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (!nextState) { // If collapsing player
      setShowLyrics(false);
    }
  }, [isExpanded]);

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

  const toggleLyricsView = useCallback(() => {
      const willShow = !showLyrics;
      if (isExpanded) {
          setShowLyrics(willShow);
          if (willShow && !lyrics && !loadingLyrics) {
              fetchLyrics();
          }
      } else {
          setIsExpanded(true);
          setShowLyrics(true);
          if (!lyrics && !loadingLyrics) {
             fetchLyrics();
          }
      }
  }, [showLyrics, isExpanded, lyrics, loadingLyrics, fetchLyrics]);
  
  // Playlist functions
  const createPlaylist = useCallback((name: string, description?: string): Playlist => {
      const newPlaylist: Playlist = {
        id: `playlist-${Date.now()}`,
        name,
        description,
        songIds: [],
      };
      setPlaylists(prev => [...prev, newPlaylist]);
      return newPlaylist;
  }, []);

  const addSongToPlaylist = useCallback((playlistId: string, song: Song) => {
    let playlistName = '';
    setPlaylists(prev => prev.map(p => {
        if (p.id === playlistId) {
            playlistName = p.name;
            if (p.songIds.includes(song.id)) {
                // Song is already in the playlist
                return p;
            }
            const updatedPlaylist = { ...p, songIds: [...p.songIds, song.id] };
            // Set cover art if it's the first song
            if (!updatedPlaylist.coverArt) {
              updatedPlaylist.coverArt = song.coverArt;
            }
            return updatedPlaylist;
        }
        return p;
    }));
    toast({
        title: "Added to Playlist",
        description: `"${song.title}" has been added to ${playlistName}.`,
    });
  }, [toast]);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
      setPlaylists(prev => prev.map(p => {
          if (p.id === playlistId) {
              const updatedPlaylist = { ...p, songIds: p.songIds.filter(id => id !== songId) };
              // If the removed song was the cover art, find a new one or remove it
              if (p.coverArt && p.songIds.length > 0 && p.songIds[0] === songId) {
                  // This part requires fetching song details to get new cover art.
                  // For simplicity, we can clear it or set to a placeholder.
                  // A more advanced implementation would fetch the next song's cover.
                  updatedPlaylist.coverArt = undefined; // Or a placeholder
              }
              return updatedPlaylist;
          }
          return p;
      }));
  }, []);

  const getPlaylistById = useCallback((id: string) => {
    return playlists.find(p => p.id === id);
  }, [playlists]);
  
  const downloadSong = useCallback(async (song: Song) => {
    if (!song) return;
    if (downloadedSongs.some(s => s.id === song.id)) {
        toast({ title: 'Already Downloaded', description: `"${song.title}" is already in your downloads.` });
        return;
    }

    try {
      toast({ title: 'Starting Download', description: `Downloading "${song.title}"...` });
      const response = await fetch(song.url);
      if (!response.ok) throw new Error('Network response was not ok.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${song.artist} - ${song.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      setDownloadedSongs(prev => [...prev, song]);
      toast({ title: 'Download Complete', description: `"${song.title}" has been added to your downloads.` });
    } catch (error) {
      console.error('Error downloading the song:', error);
      toast({ variant: 'destructive', title: 'Download Failed', description: 'Could not download the song.' });
    }
  }, [downloadedSongs, toast]);

  const value = useMemo(() => ({
    loading,
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
    isShuffled,
    toggleShuffle,
    showLyrics,
    lyrics,
    loadingLyrics,
    toggleLyricsView,
    currentLineIndex,
    playlists,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getPlaylistById,
    downloadedSongs,
    downloadSong,
  }), [
    loading,
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    progress,
    duration,
    handleProgressChange,
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
    isShuffled,
    toggleShuffle,
    showLyrics,
    lyrics,
    loadingLyrics,
    toggleLyricsView,
    currentLineIndex,
    playlists,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getPlaylistById,
    downloadedSongs,
    downloadSong,
  ]);

  return (
    <MusicPlayerContext.Provider
      value={value}
    >
      <audio ref={audioRef} crossOrigin="anonymous" preload="metadata" />
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
