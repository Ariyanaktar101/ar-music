
'use client';

import { SongList } from '@/components/song-list';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { Download, ArrowLeft, Music } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function DownloadsPage() {
  const { downloadedSongs } = useMusicPlayer();

  return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/library">
                <ArrowLeft />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                <Download className="h-8 w-8 text-primary" /> Downloads
              </h1>
              <p className="text-muted-foreground mt-1">{downloadedSongs.length} songs</p>
            </div>
        </div>

        {downloadedSongs.length > 0 ? (
          <SongList songs={downloadedSongs} />
        ) : (
          <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full pt-16 gap-4">
            <Music className="h-16 w-16" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Songs you download will appear here</h3>
              <p className="text-sm">Save songs for offline listening from the player options.</p>
            </div>
          </div>
        )}
      </motion.div>
  );
}
