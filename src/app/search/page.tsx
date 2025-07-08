'use client';

import React, { useState, useTransition, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { Input } from '@/components/ui/input';
import { SongCard } from '@/components/song-card';
import type { Song } from '@/lib/types';
import { handleSearch } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader } from 'lucide-react';

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
  const [searched, setSearched] = useState(!!initialGenre);

  useEffect(() => {
    if (initialGenre) {
      setQuery(initialGenre);
      setSearched(true);
      startTransition(async () => {
        const searchResults = await handleSearch(initialGenre);
        setResults(searchResults);
      });
    }
  }, [initialGenre]);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    setSearched(true);
    startTransition(async () => {
      const searchResults = await handleSearch(query);
      setResults(searchResults);
    });
  };

  const onGenreClick = (genre: string) => {
    setQuery(genre);
    setSearched(true);
    startTransition(async () => {
        const searchResults = await handleSearch(genre);
        setResults(searchResults);
    });
  }

  return (
    <div>
      <form onSubmit={onSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search for songs, artists, or albums" 
          className="pl-10 text-base md:text-lg h-12 md:h-14" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <section className="mt-8">
        {isPending ? (
          <div className="flex justify-center items-center mt-10">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : searched ? (
          results.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold font-headline tracking-tight">
                  Showing results for "{query}"
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
                  {results.map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
                </div>
              </div>
          ) : (
              <div className="text-center mt-10 text-muted-foreground">
                  <p>No results found for "{query}".</p>
                  <p>Try searching for something else.</p>
              </div>
          )
        ) : (
          <div>
              <h2 className="text-2xl font-semibold font-headline tracking-tight">
              Browse Genres
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
              {genres.map((genre, index) => (
                <Card 
                  key={genre} 
                  className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${genreGradients[index % genreGradients.length]}`}
                  onClick={() => onGenreClick(genre)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-white">{genre}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
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
