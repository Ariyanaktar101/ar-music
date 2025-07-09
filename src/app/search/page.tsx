'use client';

import React, { useState, useTransition, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Input } from '@/components/ui/input';
import { SongList } from '@/components/song-list';
import type { Song } from '@/lib/types';
import { handleSearch } from './actions';
import { Search, Loader, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 
  'Bollywood', 'Punjabi', 'Lofi', 'Workout'
];

const genreGradients = [
    'from-chart-1 to-chart-2', 'from-chart-2 to-chart-3', 'from-chart-3 to-chart-4',
    'from-chart-4 to-chart-5', 'from-chart-5 to-chart-1', 'from-primary to-accent',
    'from-chart-1 to-primary', 'from-chart-2 to-accent', 'from-chart-3 to-primary',
    'from-chart-4 to-accent', 'from-chart-5 to-primary', 'from-primary to-chart-3'
];

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre');

  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<Song[]>([]);
  const [query, setQuery] = useState(initialGenre || '');
  const debouncedQuery = useDebounce(query, 300);
  const [hasSearched, setHasSearched] = useState(false);

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
    if (debouncedQuery) {
        performSearch(debouncedQuery);
    } else {
        setResults([]);
        setHasSearched(false);
    }
  }, [debouncedQuery, performSearch]);

  useEffect(() => {
    if (initialGenre) {
      setQuery(initialGenre);
    }
  }, [initialGenre]);

  const onGenreClick = (genre: string) => {
    setQuery(genre);
    performSearch(genre);
  }

  const showGenreGrid = !query && !hasSearched;

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
        ) : hasSearched ? (
          results.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold font-headline tracking-tight mb-4">
                  Top result
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
        ) : showGenreGrid ? (
          <div>
              <h2 className="text-2xl font-semibold font-headline tracking-tight">
              Browse all
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
              {genres.map((genre, index) => (
                <div
                  key={genre}
                  onClick={() => onGenreClick(genre)}
                  className={cn(
                    'group aspect-square rounded-lg overflow-hidden relative p-4 flex flex-col justify-end',
                    'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer',
                    'bg-gradient-to-br',
                    genreGradients[index % genreGradients.length]
                  )}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <h3 className="relative z-10 font-extrabold text-2xl text-white drop-shadow-md">{genre}</h3>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default function SearchPage() {
    return (
        <AppShell>
            <Suspense fallback={
                <div className="flex justify-center items-center h-full">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
            }>
                <SearchPageComponent />
            </Suspense>
        </AppShell>
    )
}
