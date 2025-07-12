
'use client';

import { SongList } from '@/components/song-list';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { getSongsByIds } from '@/lib/api';
import type { Song } from '@/lib/types';
import { Heart, Music, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';


function LikedSongsSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
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
    )
}


export default function LikedSongsPage() {
  const { favoriteSongs } = useMusicPlayer();
  const [likedSongsDetails, setLikedSongsDetails] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      setLoading(true);
      if (favoriteSongs.length > 0) {
        const songDetails = await getSongsByIds(favoriteSongs);
        setLikedSongsDetails(songDetails);
      } else {
        setLikedSongsDetails([]);
      }
      setLoading(false);
    };

    fetchLikedSongs();
    // By stringifying the dependency, we ensure the effect runs on content change, not just reference change.
  }, [JSON.stringify(favoriteSongs)]);

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/library">
                <ArrowLeft />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                <Heart className="h-8 w-8 text-primary fill-primary" /> Liked Songs
              </h1>
              <p className="text-muted-foreground mt-1">{favoriteSongs.length} songs</p>
            </div>
        </div>

        {loading ? (
          <LikedSongsSkeleton />
        ) : likedSongsDetails.length > 0 ? (
          <SongList songs={likedSongsDetails} />
        ) : (
          <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full pt-16 gap-4">
            <Music className="h-16 w-16" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Songs you like will appear here</h3>
              <p className="text-sm">Save songs by tapping the heart icon.</p>
            </div>
             <Button asChild variant="secondary" className="rounded-full mt-4">
              <Link href="/search">
                Find Songs
              </Link>
            </Button>
          </div>
        )}
      </div>
  );
}
