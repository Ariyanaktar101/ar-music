'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { Song, Playlist } from '@/lib/types';
import { getLyrics, GetLyricsOutput } from '@/ai/flows/get-lyrics-flow';
import { generatePlaylistArt } from '@/ai/flows/generate-playlist-art-flow';
import { getRelatedSongs } from '@/ai/flows/get-related-songs-flow';
import { handleSearch } from '@/app/search/actions';
import { useToast } from '@/hooks/use-toast';

interface LyricAnalysis {
    mood: string;
    theme: string;
}

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
  
  isShuffled: boolean;
  toggleShuffle: () => void;
  
  isRadioMode: boolean;
  toggleRadioMode: () => void;

  showLyrics: boolean;
  lyrics: string | null;
  loadingLyrics: boolean;
  toggleLyricsView: () => void;
  currentLineIndex: number | null;
  
  playlists: Playlist[];
  createPlaylist: (name: string, description?: string) => Playlist;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  
  downloadedSongs: Song[];
  downloadSong: (song: Song) => void;

  lyricAnalysis: LyricAnalysis | null;
  loadingLyricAnalysis: boolean;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

interface LyricTimings {
  line: string;
  startTime: number;
}

const MOOD_TRANSITION_THRESHOLD = 15;
const ALL_MOODS = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'upbeat'];

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
  
  // Radio Mode State
  const [isRadioMode, setIsRadioMode] = useState(false);
  const [radioQueue, setRadioQueue] = useState<Song[]>([]);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [moodSongCount, setMoodSongCount] = useState(0);
  const radioQueueRef = useRef(radioQueue); // Ref to get the latest state in callbacks

  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);
  const [lyricTimings, setLyricTimings] = useState<LyricTimings[]>([]);
  const [lyricAnalysis, setLyricAnalysis] = useState<LyricAnalysis | null>(null);
  const [loadingLyricAnalysis, setLoadingLyricAnalysis] = useState(false);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  const [downloadedSongs, setDownloadedSongs] = useState<Song[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const { toast } = useToast();
  
  // Update ref whenever state changes
  useEffect(() => {
    radioQueueRef.current = radioQueue;
  }, [radioQueue]);

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
      
      const storedRadio = localStorage.getItem('ar-music-radio');
      if (storedRadio) setIsRadioMode(JSON.parse(storedRadio));

    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const savePlaylists = useCallback((newPlaylists: Playlist[]) => {
      setPlaylists(newPlaylists);
      if (!loading) {
        localStorage.setItem('ar-music-playlists', JSON.stringify(newPlaylists));
      }
  }, [loading]);

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
    localStorage.setItem('ar-music-shuffle', JSON.stringify(isShuffled));
  }, [isShuffled, loading]);
  
  useEffect(() => {
    if (loading) return;
    localStorage.setItem('ar-music-radio', JSON.stringify(isRadioMode));
  }, [isRadioMode, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem('ar-music-downloads', JSON.stringify(downloadedSongs));
  }, [downloadedSongs, loading]);
  
  const addSongToRecents = useCallback((song: Song) => {
    setRecentlyPlayed(prev => {
        const filtered = prev.filter(s => s.id !== song.id);
        const newRecents = [song, ...filtered];
        return newRecents.slice(0, 50); // Increased recent history
    });
  }, []);

  const fetchAndSetLyricAnalysis = useCallback(async (song: Song) => {
        setLoadingLyricAnalysis(true);
        setLyricAnalysis(null);
        try {
            const result = await getLyrics({
                songTitle: song.title,
                artist: song.artist,
                album: song.album,
            });
            if (result.analysis) {
                setLyricAnalysis(result.analysis);
                return result.analysis;
            }
        } catch (error) {
            console.error("Failed to fetch lyric analysis:", error);
        } finally {
            setLoadingLyricAnalysis(false);
        }
        return null;
  }, []);

  const playSong = useCallback((song: Song, queue: Song[] = []) => {
    if (!song.url) {
        toast({
            variant: "destructive",
            title: "Playback Not Available",
            description: "This song does not have a valid playback URL.",
        });
        return;
    }

    if (currentSong?.id === song.id) {
      if (audioRef.current) {
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
      }
      return;
    }
    
    setCurrentSong(song);

    if (!isRadioMode) {
      const newQueue = queue.length > 0 ? queue : [song];
      setCurrentQueue(newQueue);
      if (isShuffled) {
        const otherSongs = newQueue.filter(s => s.id !== song.id);
        setShuffledQueue([song, ...shuffleArray(otherSongs)]);
      }
    } else {
        // When in radio mode, playing a new song resets the radio queue
        setCurrentMood(null);
        setRadioQueue([]);
        setMoodSongCount(0);
    }

    addSongToRecents(song);
    
    setShowLyrics(false);
    setLyrics(null);
    setCurrentLineIndex(null);
    setLyricTimings([]);
    fetchAndSetLyricAnalysis(song);
    
    if (audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Autoplay was prevented.", e);
        toast({
          variant: "destructive",
          title: "Playback Failed",
          description: "Could not play the song. The source may be invalid.",
        });
        setIsPlaying(false);
      });
    }
  }, [toast, currentSong, isPlaying, isShuffled, addSongToRecents, isRadioMode, fetchAndSetLyricAnalysis]);

  const fillRadioQueue = useCallback(async (seedSong: Song, mood: string) => {
    try {
        const related = await getRelatedSongs({ songTitle: seedSong.title, mood: mood });
        if (!related.queries || related.queries.length === 0) {
            throw new Error("AI did not return any related song queries.");
        }

        const searchPromises = related.queries.map(q => handleSearch(q, 1));
        const searchResults = await Promise.all(searchPromises);
        
        const newSongs = searchResults
            .flat()
            .filter((song): song is Song => song !== null)
            .filter(song => song.id !== seedSong.id && !radioQueueRef.current.some(s => s.id === song.id));
        
        if (newSongs.length > 0) {
            setRadioQueue(prev => [...prev, ...newSongs]);
        } else {
            // Fallback: if AI songs are not found, search for songs of the same artist
            const fallbackSongs = await handleSearch(seedSong.artist, 10);
            const filteredFallback = fallbackSongs.filter(song => song.id !== seedSong.id && !radioQueueRef.current.some(s => s.id === song.id));
            setRadioQueue(prev => [...prev, ...filteredFallback]);
        }
    } catch (error) {
        console.error("Failed to fill radio queue:", error);
        // Fallback to a random popular song
        const fallbackSongs = await handleSearch('top hindi songs', 10);
        setRadioQueue(prev => [...prev, ...fallbackSongs.filter(s => s.id !== seedSong.id)]);
    }
  }, []);

  const playNextSongInRadio = useCallback(async () => {
    if (!currentSong) return;

    if (radioQueue.length > 0) {
        const nextSong = radioQueue[0];
        setRadioQueue(prev => prev.slice(1));
        playSong(nextSong, [nextSong]);
        setMoodSongCount(prev => prev + 1);
        return;
    }

    // Queue is empty, need to fetch more songs
    toast({ title: "Finding similar songs...", duration: 2000 });
    let analysis = lyricAnalysis;
    if (!analysis) {
        analysis = await fetchAndSetLyricAnalysis(currentSong);
    }
    
    let moodToUse = currentMood;
    if (moodSongCount >= MOOD_TRANSITION_THRESHOLD) {
        // Time to transition mood
        const otherMoods = ALL_MOODS.filter(m => m !== currentMood);
        moodToUse = otherMoods[Math.floor(Math.random() * otherMoods.length)];
        setCurrentMood(moodToUse);
        setMoodSongCount(0);
        toast({ title: `Changing mood to ${moodToUse}...`, duration: 2000 });
    } else if (!moodToUse) {
        moodToUse = analysis?.mood || 'popular';
        setCurrentMood(moodToUse);
    }

    await fillRadioQueue(currentSong, moodToUse);
    // After filling, check the ref directly as state update is async
    if (radioQueueRef.current.length > 0) {
        const nextSong = radioQueueRef.current[0];
        setRadioQueue(prev => prev.slice(1));
        playSong(nextSong, [nextSong]);
        setMoodSongCount(prev => prev + 1);
    } else {
        setIsPlaying(false);
    }
}, [currentSong, radioQueue, lyricAnalysis, currentMood, moodSongCount, playSong, fillRadioQueue, fetchAndSetLyricAnalysis, toast]);


  const playNextSongInQueue = useCallback(() => {
    if (!currentSong) return;
    const queue = isShuffled ? shuffledQueue : currentQueue;
    if (queue.length === 0) return;

    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    let nextIndex = (currentIndex + 1);

    if (nextIndex >= queue.length) {
      if(isShuffled) {
        const newShuffledQueue = shuffleArray(currentQueue);
        setShuffledQueue(newShuffledQueue);
        if (newShuffledQueue.length > 0) playSong(newShuffledQueue[0], currentQueue);
        return;
      }
      nextIndex = 0; // Loop for non-shuffled queue
    }
    
    const nextSong = queue[nextIndex];
    if (nextSong) playSong(nextSong, currentQueue);
    else setIsPlaying(false);
  }, [currentSong, currentQueue, shuffledQueue, isShuffled, playSong]);


  const handleSongEnd = useCallback(() => {
      if (isRadioMode) {
          playNextSongInRadio();
      } else {
          playNextSongInQueue();
      }
  }, [isRadioMode, playNextSongInRadio, playNextSongInQueue]);

  useEffect(() => {
    if (lyrics && duration > 0) {
      const lines = lyrics.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) {
        setLyricTimings([]);
        return;
      }
      
      const effectiveDuration = duration - 2;
      const timePerLine = effectiveDuration / lines.length;

      const timings = lines.map((line, index) => {
        return { line, startTime: index * timePerLine + 1 };
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

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleSongEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, [isPlaying, lyricTimings, currentLineIndex, handleSongEnd]);

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
  
  const toggleRadioMode = useCallback(() => {
    setIsRadioMode(prev => !prev);
    // When turning radio mode off, clear the radio queue
    if (isRadioMode) {
      setRadioQueue([]);
      setCurrentMood(null);
      setMoodSongCount(0);
    }
  }, [isRadioMode]);

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
    if (isRadioMode) {
      playNextSongInRadio();
    } else {
      playNextSongInQueue();
    }
  }, [isRadioMode, playNextSongInRadio, playNextSongInQueue]);

  const skipBackward = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const history = recentlyPlayed.slice(1); // Exclude current song
    if (history.length > 0) {
      playSong(history[0], currentQueue);
    }
  }, [recentlyPlayed, currentQueue, playSong]);


  const closePlayer = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setCurrentSong(null);
      setIsPlaying(false);
      setIsExpanded(false);
      setProgress(0);
      setDuration(0);
  }, []);

  const isFavorite = useCallback((songId: string) => {
    return favoriteSongs.includes(songId);
  }, [favoriteSongs]);

  const toggleFavorite = useCallback((songId: string) => {
    setFavoriteSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    })
  }, []);

  const toggleExpandPlayer = useCallback(() => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (!nextState) { 
      setShowLyrics(false);
    }
  }, [isExpanded]);

  const fetchLyrics = useCallback(async () => {
    if (!currentSong) return;
    setLoadingLyrics(true);
    setLyrics(null);
    setCurrentLineIndex(null);
    const analysis = await fetchAndSetLyricAnalysis(currentSong);

    try {
        const result: GetLyricsOutput = await getLyrics({ 
            songTitle: currentSong.title, 
            artist: currentSong.artist,
            album: currentSong.album,
        });
        if (result.lyrics && result.lyrics.trim() !== "[No lyrics available]") {
            setLyrics(result.lyrics);
        } else {
            setLyrics(null);
        }
    } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        setLyrics(null);
    } finally {
        setLoadingLyrics(false);
    }
  }, [currentSong, fetchAndSetLyricAnalysis]);

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
  
  const createPlaylist = useCallback((name: string, description?: string): Playlist => {
      const newPlaylist: Playlist = {
        id: `playlist-${Date.now()}`,
        name,
        description,
        songIds: [],
      };
      savePlaylists([...playlists, newPlaylist]);
      return newPlaylist;
  }, [playlists, savePlaylists]);

  const addSongToPlaylist = useCallback((playlistId: string, song: Song) => {
    let playlistName = '';
    
    const newPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
          playlistName = p.name;
          if (p.songIds.includes(song.id)) return p;
          const updatedPlaylist = { ...p, songIds: [...p.songIds, song.id] };
          if (!updatedPlaylist.coverArt && song.coverArt) {
            updatedPlaylist.coverArt = song.coverArt;
            generatePlaylistArt({ playlistName: p.name })
              .then(art => {
                if (art.imageUrl) {
                   // Re-fetch playlists from state to ensure we're not overwriting concurrent changes
                  setPlaylists(currentPlaylists => {
                    const latestPlaylists = currentPlaylists.map(pl => 
                      pl.id === playlistId ? { ...pl, coverArt: art.imageUrl } : pl
                    );
                    savePlaylists(latestPlaylists);
                    return latestPlaylists;
                  });
                }
              })
              .catch(err => console.error("Failed to generate playlist art", err));
          }
          return updatedPlaylist;
      }
      return p;
    });

    savePlaylists(newPlaylists);

    toast({
        title: "Added to Playlist",
        description: `"${song.title}" has been added to ${playlistName}.`,
    });
  }, [playlists, savePlaylists, toast]);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
      const newPlaylists = playlists.map(p => {
        if (p.id === playlistId) {
            const updatedSongIds = p.songIds.filter(id => id !== songId);
            const updatedPlaylist = { ...p, songIds: updatedSongIds };
            if (updatedSongIds.length === 0) {
                updatedPlaylist.coverArt = undefined;
            }
            return updatedPlaylist;
        }
        return p;
      });
      savePlaylists(newPlaylists);
  }, [playlists, savePlaylists]);

  const getPlaylistById = useCallback((id: string) => {
    return playlists.find(p => p.id === id);
  }, [playlists]);

  const downloadSong = useCallback(async (song: Song) => {
    if(!song.url) {
      toast({ variant: 'destructive', title: 'Download Not Available', description: 'This song does not have a downloadable link.' });
      return;
    }
    toast({ variant: 'destructive', title: 'Download Not Implemented', description: 'Downloading from this source is not supported.' });
  }, [toast]);

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
    isRadioMode,
    toggleRadioMode,
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
    lyricAnalysis,
    loadingLyricAnalysis,
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
    isRadioMode,
    toggleRadioMode,
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
    lyricAnalysis,
    loadingLyricAnalysis,
  ]);

  return (
    <MusicPlayerContext.Provider
      value={value}
    >
      <audio ref={audioRef} crossOrigin="anonymous" preload="metadata" playsInline />
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
