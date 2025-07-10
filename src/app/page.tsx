'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import { searchSongs } from '@/lib/api';
import type { Song } from '@/lib/types';
import { SongCard } from '@/components/song-card';
import { SongList } from '@/components/song-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { GreetingHeader } from '@/components/greeting-header';
import { RefreshCw, Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 
  'Bollywood', 'Punjabi', 'Lofi', 'Workout'
];

const romanticQueries = [
  "top romantic hindi songs",
  "latest love songs bollywood",
  "90s romantic hindi hits",
  "arijit singh romantic songs",
  "jubin nautiyal love songs",
  "soft hindi romantic songs"
];

function HindiHitsSkeleton() {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
        </div>
    )
}

function TrendingSongsSkeleton() {
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


export default function Home() {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [hindiHits, setHindiHits] = useState<Song[]>([]);
  const [loadingHits, setLoadingHits] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  const fetchTrendingSongs = async () => {
    setLoadingTrending(true);
    const songs = await searchSongs("latest bollywood songs", 20);
    setTrendingSongs(songs);
    setLoadingTrending(false);
  }

  const fetchHindiHits = async () => {
    setLoadingHits(true);
    const randomQuery = romanticQueries[Math.floor(Math.random() * romanticQueries.length)];
    const songs = await searchSongs(randomQuery, 6);
    setHindiHits(songs);
    setLoadingHits(false);
  };
  
  useEffect(() => {
    fetchHindiHits();
    fetchTrendingSongs();
  }, []);

  return (
    <AppShell>
      <div className="space-y-12">
        <GreetingHeader />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-headline tracking-wide uppercase">
              Hindi Hits
            </h2>
            <Button variant="ghost" size="icon" onClick={fetchHindiHits} disabled={loadingHits}>
              {loadingHits ? <Loader className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
            </Button>
          </div>
           {loadingHits ? <HindiHitsSkeleton /> : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {hindiHits.map((song) => (
                <SongCard key={song.id} song={song} />
                ))}
            </div>
           )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold font-headline tracking-tight mb-4">
            Browse All
          </h2>
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {genres.map((genre) => (
                <CarouselItem key={genre} className="basis-auto">
                    <Button asChild variant="outline" className="rounded-full px-5 py-2 text-sm font-semibold">
                      <Link href={`/search?genre=${encodeURIComponent(genre)}`}>
                        {genre}
                      </Link>
                    </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold font-headline tracking-tight uppercase mb-4">
            Trending Now
          </h2>
          {loadingTrending ? <TrendingSongsSkeleton /> : <SongList songs={trendingSongs} />}
        </section>
      </div>
    </AppShell>
  );
}
