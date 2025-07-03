'use client';

import React, { useState, useTransition } from 'react';
import { AppShell } from '@/components/app-shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader } from 'lucide-react';
import { SongCard } from '@/components/song-card';
import type { Song } from '@/lib/types';
import { handleSearch } from './actions';
import { Card, CardContent } from '@/components/ui/card';

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 
  'Bollywood', 'Punjabi', 'Lofi', 'Workout'
];

const genreColors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-lime-500', 'bg-cyan-500', 'bg-fuchsia-500'
];


export default function SearchPage() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<Song[]>([]);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

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
    <AppShell>
      <div className="animate-in fade-in-50">
        <form onSubmit={onSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for songs, artists, or albums" 
            className="pl-10 text-lg h-14" 
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
                    Search Results for "{query}"
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
                    className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${genreColors[index % genreColors.length]}`}
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
    </AppShell>
  );
}
