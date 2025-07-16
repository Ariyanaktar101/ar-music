
'use client';

import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { handleSearch } from './search/actions';
import type { Song } from '@/lib/types';
import { SongCard } from '@/components/song-card';
import { SongList } from '@/components/song-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GreetingHeader } from '@/components/greeting-header';
import { RefreshCw, Loader, Moon, Sun, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function FeaturedHitsSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-4">
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

const genres = [
  'Bollywood',
  'Punjabi',
  'Pop',
  'Hip Hop',
  'Rock',
  'Electronic',
  'R&B',
  'Indie'
];

function HomeComponent() {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [allFeaturedHits, setAllFeaturedHits] = useState<Song[]>([]);
  const [loadingFeaturedHits, setLoadingFeaturedHits] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTrendingSongs = async () => {
    setLoadingTrending(true);
    const songs = await handleSearch("top music hits", 40);
    // Filter out specific devotional songs
    const filteredSongs = songs.filter(song => !song.title.toLowerCase().includes('hanuman chalisa'));
    setTrendingSongs(filteredSongs);
    setLoadingTrending(false);
  }

  const fetchFeaturedHits = useCallback(async () => {
    setLoadingFeaturedHits(true);
    // Fetch a larger pool of songs to allow for randomization
    const songs = await handleSearch("top music hits", 40);
    setAllFeaturedHits(songs);
    setLoadingFeaturedHits(false);
  }, []);
  
  const refreshFeaturedHits = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  const displayedFeaturedHits = useMemo(() => {
    if (allFeaturedHits.length === 0) return [];
    // Shuffle the array and take the first 6
    return [...allFeaturedHits].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [allFeaturedHits, refreshKey]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  useEffect(() => {
    fetchFeaturedHits();
    fetchTrendingSongs();
  }, [user, fetchFeaturedHits]);

  return (
      <motion.div 
        className="space-y-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GreetingHeader />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-headline tracking-wide uppercase">
              Featured Hits
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
               <Button asChild variant="ghost" size="icon">
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                  </Link>
                </Button>
              <Button variant="ghost" size="icon" onClick={refreshFeaturedHits} disabled={loadingFeaturedHits}>
                {loadingFeaturedHits ? <Loader className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
              </Button>
            </div>
          </div>
           {loadingFeaturedHits ? <FeaturedHitsSkeleton /> : (
            <motion.div 
              className="grid grid-cols-3 gap-4"
              key={refreshKey} // Add key to re-trigger animation on refresh
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                {displayedFeaturedHits.map((song) => (
                  <SongCard key={song.id} song={song} playlist={displayedFeaturedHits} />
                ))}
            </motion.div>
           )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold font-headline tracking-tight mb-4">
            Browse Genres
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {genres.map((genre) => (
                <CarouselItem key={genre} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <Button asChild variant="outline" size="lg" className="rounded-full w-full">
                    <Link href={`/search?genre=${genre}`}>
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
      </motion.div>
  );
}

export default memo(HomeComponent);
