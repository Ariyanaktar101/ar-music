
'use client';

import { useState, useEffect, memo } from 'react';
import { handleSearch, getRecommendedSongs } from './search/actions';
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
import { useAuth } from '@/context/AuthContext';

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'R&B', 'Country', 
  'Lofi', 'Workout'
];

function RecommendedSongsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
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
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const fetchTrendingSongs = async () => {
    setLoadingTrending(true);
    const songs = await handleSearch("latest bollywood songs", 40);
    setTrendingSongs(songs);
    setLoadingTrending(false);
  }

  const fetchRecommendedSongs = async () => {
    setLoadingRecommended(true);
    // Use user's name as a seed for recommendations, or a default value
    const songs = await getRecommendedSongs(user?.name || 'defaultUser');
    setRecommendedSongs(songs);
    setLoadingRecommended(false);
  };
  
  const refreshRecommendedSongs = () => {
    fetchRecommendedSongs();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  useEffect(() => {
    fetchRecommendedSongs();
    fetchTrendingSongs();
  }, [user]); // Refetch recommendations when user changes

  return (
      <div className="space-y-12">
        <GreetingHeader />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-headline tracking-wide uppercase">
              Recommended For You
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={refreshRecommendedSongs} disabled={loadingRecommended}>
                {loadingRecommended ? <Loader className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
              </Button>
            </div>
          </div>
           {loadingRecommended ? <RecommendedSongsSkeleton /> : (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                {recommendedSongs.slice(0, 12).map((song) => (
                  <SongCard key={song.id} song={song} playlist={recommendedSongs.slice(0, 12)} />
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
