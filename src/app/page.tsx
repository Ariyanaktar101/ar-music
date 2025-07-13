
'use client';

import { useState, useEffect, memo } from 'react';
import { handleSearch } from './search/actions';
import type { Song } from '@/lib/types';
import { SongCard } from '@/components/song-card';
import { SongList } from '@/components/song-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { GreetingHeader } from '@/components/greeting-header';
import { RefreshCw, Loader, Moon, Sun } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { motion } from 'framer-motion';

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'R&B', 'Country', 
  'Lofi', 'Workout'
];

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function HindiHitsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
            {Array.from({ length: 10 }).map((_, i) => (
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};


function HomeComponent() {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [hindiHits, setHindiHits] = useState<Song[]>([]);
  const [loadingHits, setLoadingHits] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const { theme, setTheme } = useTheme();

  const fetchTrendingSongs = async () => {
    setLoadingTrending(true);
    const songs = await handleSearch("latest bollywood songs", 40);
    setTrendingSongs(songs);
    setLoadingTrending(false);
  }

  const fetchHindiHits = async () => {
    setLoadingHits(true);
    const songs = await handleSearch("top hindi songs", 6);
    setHindiHits(songs);
    setLoadingHits(false);
  };
  
  const refreshHindiHits = () => {
    setLoadingHits(true);
    handleSearch("top hindi songs", 6).then(songs => {
        setHindiHits(shuffleArray(songs));
        setLoadingHits(false);
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  useEffect(() => {
    fetchHindiHits();
    fetchTrendingSongs();
  }, []);

  return (
      <div className="space-y-12">
        <GreetingHeader />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-headline tracking-wide uppercase">
              Top Hits
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={refreshHindiHits} disabled={loadingHits}>
                {loadingHits ? <Loader className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
              </Button>
            </div>
          </div>
           {loadingHits ? <HindiHitsSkeleton /> : (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                {hindiHits.slice(0, 6).map((song) => (
                  <SongCard key={song.id} song={song} playlist={hindiHits.slice(0, 6)} />
                ))}
            </motion.div>
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
  );
}

export default memo(HomeComponent);
