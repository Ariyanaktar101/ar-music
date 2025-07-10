
'use client';

import { AppShell } from '@/components/app-shell';
import { SongList } from '@/components/song-list';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { Clock, ArrowLeft, Music } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RecentlyPlayedPage() {
  const { recentlyPlayed } = useMusicPlayer();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/library">
                <ArrowLeft />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                <Clock className="h-8 w-8 text-primary" /> Recently Played
              </h1>
              <p className="text-muted-foreground mt-1">{recentlyPlayed.length} songs</p>
            </div>
        </div>

        {recentlyPlayed.length > 0 ? (
          <SongList songs={recentlyPlayed} />
        ) : (
          <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full pt-16 gap-4">
            <Music className="h-16 w-16" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Your recently played songs will appear here</h3>
              <p className="text-sm">Start listening to build your history.</p>
            </div>
             <Button asChild variant="secondary" className="rounded-full mt-4">
              <Link href="/">
                Go to Home
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
