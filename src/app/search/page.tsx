
'use client';

import React, { useState, useTransition, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SongList } from '@/components/song-list';
import type { Song } from '@/lib/types';
import { handleSearch } from './actions';
import { Search, Loader, Music, History, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const LOCAL_STORAGE_RECENT_SEARCHES = 'ar-music-recent-searches';

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
  const debouncedQuery = useDebounce(query, 200);
  const [hasSearched, setHasSearched] = useState(!!initialGenre);
  const [newlyAdded, setNewlyAdded] = useState<Song[]>([]);
  const [loadingNewlyAdded, setLoadingNewlyAdded] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_RECENT_SEARCHES);
        if(stored) {
            setRecentSearches(JSON.parse(stored));
        }
    } catch (error) {
        console.error("Failed to parse recent searches", error);
    }
  }, [])
  
  const saveRecentSearches = (searches: string[]) => {
      setRecentSearches(searches);
      localStorage.setItem(LOCAL_STORAGE_RECENT_SEARCHES, JSON.stringify(searches));
  }
  
  const addRecentSearch = useCallback((searchTerm: string) => {
    const lowercasedTerm = searchTerm.toLowerCase().trim();
    if (!lowercasedTerm) return;
    
    setRecentSearches(prevSearches => {
      const newSearches = [lowercasedTerm, ...prevSearches.filter(s => s.toLowerCase() !== lowercasedTerm)];
      const searchesToSave = newSearches.slice(0, 10);
      localStorage.setItem(LOCAL_STORAGE_RECENT_SEARCHES, JSON.stringify(searchesToSave));
      return searchesToSave;
    });
  }, []);
  
  const removeRecentSearch = (searchTerm: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSearches = recentSearches.filter(s => s !== searchTerm);
    saveRecentSearches(newSearches);
  }

  const clearRecentSearches = () => {
    saveRecentSearches([]);
  }

  const performSearch = useCallback((searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    addRecentSearch(term);
    startTransition(async () => {
      const searchResults = await handleSearch(term, 100);
      setResults(searchResults);
    });
  }, [addRecentSearch]);

  useEffect(() => {
    const fetchNewlyAdded = async () => {
        setLoadingNewlyAdded(true);
        const songs = await handleSearch("new music releases", 10);
        setNewlyAdded(songs);
        setLoadingNewlyAdded(false);
    }
    fetchNewlyAdded();
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    } else {
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

  const showInitialView = !hasSearched && query === '';
  const showRecentSearches = isFocused && query === '' && recentSearches.length > 0;

  const recentSearchesVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const recentSearchesItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="What do you want to listen to?" 
          className="pl-10 text-base md:text-lg h-12 md:h-14 rounded-full" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)} // Delay blur to allow click on recent search
        />
      </div>

      <section className="mt-8">
        {isPending ? (
          <div className="flex justify-center items-center mt-10">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : showRecentSearches ? (
             <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold font-headline tracking-tight">Recent Searches</h2>
                    {recentSearches.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="text-muted-foreground hover:text-foreground">Clear all</Button>
                    )}
                </div>
                <motion.div
                  className="flex flex-wrap gap-3"
                  variants={recentSearchesVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {recentSearches.map(term => (
                        <motion.div
                          key={term}
                          layout
                          variants={recentSearchesItemVariants}
                          exit="exit"
                          initial="hidden"
                          animate="visible"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="group flex items-center bg-secondary rounded-full cursor-pointer"
                        >
                          <span onClick={() => setQuery(term)} className="py-2 pl-4 pr-3 font-medium capitalize text-secondary-foreground text-sm">
                            {term}
                          </span>
                          <button onClick={(e) => removeRecentSearch(term, e)} className="p-2 mr-1 rounded-full text-muted-foreground hover:bg-background/60 hover:text-foreground transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
            </motion.div>
        ) : hasSearched && query ? (
          results.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-semibold font-headline tracking-tight mb-4">
                  Showing results for "{query}"
                </h2>
                <SongList songs={results} />
              </motion.div>
          ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-10 text-muted-foreground flex flex-col items-center gap-4"
              >
                  <Music className="h-10 w-10"/>
                  <h3 className="text-lg font-semibold">No results found for "{query}"</h3>
                  <p className="text-sm">Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
              </motion.div>
          )
        ) : showInitialView ? (
          <div className="space-y-8">
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-semibold font-headline tracking-tight mb-4">
                  Newly Added
                </h2>
                {loadingNewlyAdded ? (
                    <NewlyAddedSkeleton />
                ) : (
                    <SongList songs={newlyAdded} />
                )}
              </motion.div>
          </div>
        ) : null}
      </section>
    </motion.div>
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
