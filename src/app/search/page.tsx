

'use client';

import React, { useState, useTransition, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SongList } from '@/components/song-list';
import type { Song } from '@/lib/types';
import { handleSearch } from './actions';
import { Search, Loader, Music } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const specialGenres = [
  { name: 'Bollywood', hint: 'indian dance', imageUrl: 'https://images.unsplash.com/photo-1616837874253-908d13b8364f?w=800' },
  { name: 'Punjabi', hint: 'punjabi culture', imageUrl: 'https://images.unsplash.com/photo-1609148383348-185a0521369a?w=800' },
];

const genres = [
  { name: 'Pop', hint: 'pop music', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800' },
  { name: 'Rock', hint: 'rock concert', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800' },
  { name: 'Electronic', hint: 'dj setup', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' },
  { name: 'Country', hint: 'country guitar', imageUrl: 'https://images.unsplash.com/photo-1525994886773-080587e161c2?w=800' },
  { name: 'Lofi', hint: 'lofi aesthetic', imageUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=800' },
  { name: 'Workout', hint: 'gym workout', imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800' },
];

function NewlyAddedSkeleton() {
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

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre');

  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<Song[]>([]);
  const [query, setQuery] = useState(initialGenre || '');
  const debouncedQuery = useDebounce(query, 300);
  const [hasSearched, setHasSearched] = useState(!!initialGenre);
  const [newlyAdded, setNewlyAdded] = useState<Song[]>([]);
  const [loadingNewlyAdded, setLoadingNewlyAdded] = useState(true);

  const performSearch = useCallback((searchTerm: string) => {
    if (!searchTerm) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    startTransition(async () => {
      const searchResults = await handleSearch(searchTerm);
      setResults(searchResults);
    });
  }, []);

  useEffect(() => {
    const fetchNewlyAdded = async () => {
        setLoadingNewlyAdded(true);
        const songs = await handleSearch("latest songs");
        setNewlyAdded(songs.slice(0, 10));
        setLoadingNewlyAdded(false);
    }
    fetchNewlyAdded();
  }, []);

  useEffect(() => {
    // Only search if the debounced query is not empty.
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    } else {
      // Clear results if the query is cleared, unless it was an initial genre search
      if (!initialGenre || (initialGenre && query === '')) {
         setResults([]);
         setHasSearched(false);
      }
    }
  }, [debouncedQuery, performSearch, initialGenre, query]);

  useEffect(() => {
    if (initialGenre) {
      setQuery(initialGenre);
    }
  }, [initialGenre]);

  const onGenreClick = (genre: string) => {
    setQuery(genre);
  }

  const showInitialView = !hasSearched && query === '';

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="What do you want to listen to?" 
          className="pl-10 text-base md:text-lg h-12 md:h-14 rounded-full" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <section className="mt-8">
        {isPending ? (
          <div className="flex justify-center items-center mt-10">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : hasSearched && query ? (
          results.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold font-headline tracking-tight mb-4">
                  Showing results for "{query}"
                </h2>
                <SongList songs={results} />
              </div>
          ) : (
              <div className="text-center mt-10 text-muted-foreground flex flex-col items-center gap-4">
                  <Music className="h-10 w-10"/>
                  <h3 className="text-lg font-semibold">No results found for "{query}"</h3>
                  <p className="text-sm">Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
              </div>
          )
        ) : showInitialView ? (
          <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                  {specialGenres.map(genre => (
                      <Button key={genre.name} variant="outline" className="rounded-full h-14 text-lg font-bold" onClick={() => onGenreClick(genre.name)}>
                          {genre.name}
                      </Button>
                  ))}
              </div>

              <div>
                <h2 className="text-2xl font-semibold font-headline tracking-tight mb-4">
                  Newly Added
                </h2>
                {loadingNewlyAdded ? (
                    <NewlyAddedSkeleton />
                ) : (
                    <SongList songs={newlyAdded} />
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold font-headline tracking-tight">
                Browse all
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-4 mt-4">
                {genres.map((genre) => (
                    <motion.div
                        key={genre.name}
                        onClick={() => onGenreClick(genre.name)}
                        className="group aspect-[10/12] rounded-lg overflow-hidden relative cursor-pointer"
                        whileHover={{ y: -8, scale: 1.05, shadow: 'lg' }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Image
                          src={genre.imageUrl}
                          alt={genre.name}
                          fill
                          data-ai-hint={genre.hint}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                          <h3 className="relative z-10 font-extrabold text-2xl text-white drop-shadow-md">{genre.name}</h3>
                      </div>
                    </motion.div>
                ))}
                </div>
              </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-full">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SearchPageComponent />
        </Suspense>
    )
}
