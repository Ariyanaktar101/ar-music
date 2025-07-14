
'use client';

import { SongList } from '@/components/song-list';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
// YouTube API does not have a bulk get-by-id, this would require changes
// For now, we assume the song details are stored somewhere or this feature is limited
import type { Song, Playlist as PlaylistType } from '@/lib/types';
import { Music, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

function PlaylistSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Skeleton className="h-40 w-40 sm:h-48 sm:w-48 shrink-0" />
                <div className="space-y-3 pt-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-2">
                        <Skeleton className="h-11 w-11" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-4 w-12" />
                    </div>
                ))}
            </div>
        </div>
    )
}


export default function PlaylistPage() {
  const params = useParams();
  const playlistId = params.id as string;
  
  const { getPlaylistById, recentlyPlayed, favoriteSongs: favoriteSongIds } = useMusicPlayer();
  
  const [playlist, setPlaylist] = useState<PlaylistType | undefined | null>(undefined);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundPlaylist = getPlaylistById(playlistId);
    setPlaylist(foundPlaylist);
  }, [playlistId, getPlaylistById]);
  
  useEffect(() => {
    // With the switch to YouTube API, we can't fetch songs by ID easily.
    // We'll try to find the songs from the user's recently played list.
    // This is a limitation of not having a proper backend/database.
    const fetchSongs = async () => {
      if (playlist === null) return;
      
      if (playlist && playlist.songIds.length > 0) {
        // Create a pool of all known songs (recents, etc.) to search through
        const songPool = [...recentlyPlayed];
        const songDetails = playlist.songIds.map(id => 
            songPool.find(song => song.id === id)
        ).filter((s): s is Song => s !== undefined);
        
        setSongs(songDetails);
      } else {
        setSongs([]);
      }
      setLoading(false);
    };

    if (playlist !== undefined) {
      setLoading(true);
      fetchSongs();
    }
  }, [playlist, recentlyPlayed]);

  if (loading) {
    return (
        <PlaylistSkeleton />
    )
  }

  if (playlist === null) {
    notFound();
  }

  if (!playlist) {
      return null; // Should be handled by loading state
  }


  return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-4">
             <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/library">
                <ArrowLeft />
              </Link>
            </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-6">
            <Card className="h-40 w-40 sm:h-48 sm:w-48 shrink-0 flex items-center justify-center bg-muted">
                 {playlist.coverArt ? (
                    <Image
                        src={playlist.coverArt}
                        alt={playlist.name}
                        width={192}
                        height={192}
                        className="rounded-lg object-cover h-full w-full"
                    />
                    ) : (
                        <Music className="h-1/2 w-1/2 text-muted-foreground" />
                    )}
            </Card>
            <div className="space-y-2 pt-2">
                <p className="text-sm font-semibold uppercase">Playlist</p>
                 <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline tracking-tight">
                    {playlist.name}
                 </h1>
                 {playlist.description && (
                    <p className="text-muted-foreground">{playlist.description}</p>
                 )}
                 <p className="text-sm text-muted-foreground pt-2">{playlist.songIds.length} songs</p>
            </div>
        </div>

        {songs.length > 0 ? (
          <SongList songs={songs} />
        ) : (
          <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full pt-16 gap-4">
            <Music className="h-16 w-16" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">This playlist is empty</h3>
              <p className="text-sm">Find some songs to add to your new playlist.</p>
               <p className="text-xs mt-2">(Note: Only recently played songs will appear in playlists now.)</p>
            </div>
             <Button asChild variant="secondary" className="rounded-full mt-4">
              <Link href="/search">
                <Plus className="mr-2 h-4 w-4" /> Add Songs
              </Link>
            </Button>
          </div>
        )}
      </motion.div>
  );
}
