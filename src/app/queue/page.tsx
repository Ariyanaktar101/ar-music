
'use client';

import { SongList } from '@/components/song-list';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { ListMusic, ArrowLeft, Music } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Song } from '@/lib/types';

export default function QueuePage() {
  const { currentSong, currentQueue, shuffledQueue, isShuffled } = useMusicPlayer();
  const router = useRouter();
  const [orderedQueue, setOrderedQueue] = useState<Song[]>([]);

  useEffect(() => {
    if (!currentSong) {
      setOrderedQueue([]);
      return;
    }

    const queueToUse = isShuffled ? shuffledQueue : currentQueue;
    const currentIndex = queueToUse.findIndex(s => s.id === currentSong.id);

    if (currentIndex === -1) {
      setOrderedQueue([]);
      return;
    }

    const upcomingSongs = queueToUse.slice(currentIndex + 1);
    const pastSongs = queueToUse.slice(0, currentIndex);
    
    // For a non-looping queue, this is correct. If it loops, this might need adjustment.
    setOrderedQueue([...upcomingSongs, ...pastSongs]);


  }, [currentSong, currentQueue, shuffledQueue, isShuffled]);

  return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                <ListMusic className="h-8 w-8 text-primary" /> Up Next
              </h1>
              <p className="text-muted-foreground mt-1">{currentQueue.length} songs in queue</p>
            </div>
        </div>

        {currentSong && (
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold text-muted-foreground mb-2">Now Playing</h2>
                    <SongList songs={[currentSong]} />
                </div>
            
                {orderedQueue.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-muted-foreground mb-2">Next in Queue</h2>
                        <SongList songs={orderedQueue} />
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
      </motion.div>
  );
}
