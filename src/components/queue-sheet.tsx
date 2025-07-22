
'use client';

import { SongList } from '@/components/song-list';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { ListMusic, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song } from '@/lib/types';
import { useEffect, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import Link from 'next/link';

export function QueueSheetContent() {
  const { currentSong, currentQueue, shuffledQueue, isShuffled } = useMusicPlayer();
  const [upcomingSongs, setUpcomingSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (!currentSong) {
      setUpcomingSongs([]);
      return;
    }

    const queueToUse = isShuffled ? shuffledQueue : currentQueue;
    const currentIndex = queueToUse.findIndex(s => s.id === currentSong.id);

    if (currentIndex === -1) {
      setUpcomingSongs([]);
      return;
    }

    const upcoming = queueToUse.slice(currentIndex + 1);
    setUpcomingSongs(upcoming);

  }, [currentSong, currentQueue, shuffledQueue, isShuffled]);

  return (
      <div className="h-full flex flex-col">
        <SheetHeader className="px-4 py-2 border-b">
           <SheetTitle className="flex items-center gap-2">
            <ListMusic className="h-6 w-6 text-primary" /> Up Next
           </SheetTitle>
           <SheetDescription>
            {currentQueue.length} songs in queue
           </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
                {currentSong && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-muted-foreground mb-2">Now Playing</h2>
                            <SongList songs={[currentSong]} />
                        </div>
                    
                        {upcomingSongs.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-muted-foreground mb-2 mt-6">Next in Queue</h2>
                                <SongList songs={upcomingSongs} />
                            </div>
                        )}
                    </div>
                )}

                {!currentSong && (
                  <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full pt-16 gap-4">
                    <Music className="h-16 w-16" />
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-foreground">The queue is empty</h3>
                      <p className="text-sm">Play a song to see the queue.</p>
                    </div>
                     <Button asChild variant="secondary" className="rounded-full mt-4">
                      <Link href="/">
                        Go to Home
                      </Link>
                    </Button>
                  </div>
                )}
            </div>
        </ScrollArea>
      </div>
  );
}
