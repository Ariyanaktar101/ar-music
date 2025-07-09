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
import Image from 'next/image';

const genres = [
  { name: 'Pop', hint: 'pop music', imageUrl: 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742' },
  { name: 'Rock', hint: 'rock concert', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3' },
  { name: 'Hip-Hop', hint: 'hip-hop artist', imageUrl: 'https://images.unsplash.com/photo-1594744806549-59549a117549' },
  { name: 'Jazz', hint: 'jazz club', imageUrl: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8' },
  { name: 'Classical', hint: 'orchestra', imageUrl: 'https://images.unsplash.com/photo-1520623136453-6a0a80c0fe80' },
  { name: 'Electronic', hint: 'dj setup', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819' },
  { name: 'R&B', hint: 'r&b singer', imageUrl: 'https://images.unsplash.com/photo-1542037104-58f6a3874b79' },
  { name: 'Country', hint: 'country guitar', imageUrl: 'https://images.unsplash.com/photo-1525994886773-080587e161c2' },
  { name: 'Bollywood', hint: 'bollywood dance', imageUrl: 'https://images.unsplash.com/photo-1626218174358-7269ff240cda' },
  { name: 'Punjabi', hint: 'punjabi dhol', imageUrl: 'https://images.unsplash.com/photo-1588636433439-565a484c6c10' },
  { name: 'Lofi', hint: 'lofi aesthetic', imageUrl: 'https://images.unsplash.com/photo-1543364195-052a1455217e' },
  { name: 'Workout', hint: 'gym workout', imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2' },
];

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre');

  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<Song[]>([]);
  const [query, setQuery] = useState(initialGenre || '');
  const debouncedQuery = useDebounce(query, 300);
  const [hasSearched, setHasSearched] = useState(!!initialGenre);

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

  const showGenreGrid = !hasSearched && query === '';

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
        ) : showGenreGrid ? (
          <div>
              <h2 className="text-2xl font-semibold font-headline tracking-tight">
              Browse all
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
              {genres.map((genre) => (
                <div
                  key={genre.name}
                  onClick={() => onGenreClick(genre.name)}
                  className="group aspect-[10/12] rounded-lg overflow-hidden relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
