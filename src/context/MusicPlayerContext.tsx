
'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { Song, Playlist } from '@/lib/types';
import { getLyrics } from '@/ai/flows/get-lyrics-flow';
import { useToast } from '@/hooks/use-toast';

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, playlist?: Song[]) => void;
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

  analyser: AnalyserNode | null;
  showVisualizer: boolean;
  toggleVisualizer: () => void;
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

  // Playlist State
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  // Download State
  const [downloadedSongs, setDownloadedSongs] = useState<Song[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(false);


  const { toast } = useToast();
  
  // Setup Web Audio API
  useEffect(() => {
    if (audioRef.current && !audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext();
      audioContextRef.current = context;

      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 256;
      setAnalyser(analyserNode);

      if (!sourceRef.current) {
        sourceRef.current = context.createMediaElementSource(audioRef.current);
      }
      
      sourceRef.current.connect(analyserNode);
      analyserNode.connect(context.destination);

      // Ensure audio context is resumed
      if (context.state === 'suspended') {
        context.resume();
      }
    }
  }, []);

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

  useEffect(() => {
    localStorage.setItem('ar-music-playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('ar-music-downloads', JSON.stringify(downloadedSongs));
  }, [downloadedSongs]);
  
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
        audioContextRef.current?.resume();
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
        const filtered = prev.filter(s => s.id !== song.id);
        const newRecents = [song, ...filtered];
        return newRecents.slice(0, 20);
    });
  }

  const playSong = (song: Song, playlist?: Song[]) => {
    if (currentSong?.id === song.id) {
        togglePlayPause();
        return;
    }
    setCurrentSong(song);
    addSongToRecents(song);
    setIsPlaying(true);
    setShowLyrics(false);
    setLyrics(null);
    setCurrentLineIndex(null);
    setLyricTimings([]);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.src = song.url;
      audioRef.current.load();
      audioContextRef.current?.resume(); // Resume context on new song
      audioRef.current.play().catch(console.error);
    }
  };

  const togglePlayPause = () => {
    if (currentSong) {
      if (!isPlaying) {
        audioContextRef.current?.resume();
      }
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
      setVolume(50);
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
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (!nextState) { // If collapsing player
      setShowLyrics(false);
      setShowVisualizer(false);
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
      setShowVisualizer(false); // Always turn off visualizer when toggling lyrics
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
  }

  const toggleVisualizer = () => {
    const willShow = !showVisualizer;
    setShowLyrics(false); // Always turn off lyrics when toggling visualizer
     if (isExpanded) {
        setShowVisualizer(willShow);
    } else {
        setIsExpanded(true);
        setShowVisualizer(true);
    }
  }
  
  // Playlist functions
  const createPlaylist = (name: string, description?: string): Playlist => {
      const newPlaylist: Playlist = {
        id: `playlist-${Date.now()}`,
        name,
        description,
        songIds: [],
      };
      setPlaylists(prev => [...prev, newPlaylist]);
      return newPlaylist;
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
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
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
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
  };

  const getPlaylistById = (id: string) => {
    return playlists.find(p => p.id === id);
  };
  
  const downloadSong = async (song: Song) => {
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
  };


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
        playlists,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        getPlaylistById,
        downloadedSongs,
        downloadSong,
        analyser,
        showVisualizer,
        toggleVisualizer,
      }}
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
