
'use client';

import { AppShell } from '@/components/app-shell';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Clock, Plus, Library as LibraryIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function QuickAccessCard({ icon: Icon, title, subtitle, href, variant }: { icon: React.ElementType, title: string, subtitle: string, href: string, variant: 'primary' | 'secondary' }) {
    return (
        <Link href={href}>
            <Card className="p-3 hover:bg-secondary/80 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-md flex items-center justify-center",
                        variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
            </Card>
        </Link>
    )
}

function EmptyLibrary() {
    return (
        <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full pt-16 gap-4">
            <LibraryIcon className="h-16 w-16" />
            <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">Start building your library</h3>
                <p className="text-sm">Save songs and create playlists to see them here.</p>
            </div>
             <Button asChild size="lg" className="rounded-full mt-4">
              <Link href="#">
                <Plus className="mr-2" /> Create Your First Playlist
              </Link>
            </Button>
        </div>
    )
}

export default function LibraryPage() {
    const { favoriteSongs, recentlyPlayed, playSong } = useMusicPlayer();

    // In a real app, you would fetch playlist data here.
    const hasPlaylists = false;
    const hasHistory = recentlyPlayed.length > 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Your Library
            </h1>
            <p className="text-muted-foreground mt-1">Your playlists and saved music</p>
        </div>

        <div className="space-y-3">
            <QuickAccessCard 
                icon={Heart}
                title="Liked Songs"
                subtitle={`${favoriteSongs.length} songs`}
                href="/library/liked"
                variant="primary"
            />
            <QuickAccessCard 
                icon={Clock}
                title="Recently Played"
                subtitle={`${recentlyPlayed.length} songs`}
                href="/library/recent"
                variant="secondary"
            />
        </div>
        
        {hasHistory && (
          <section>
            <h2 className="text-xl font-bold font-headline tracking-tight mb-4">Jump Back In</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentlyPlayed.slice(0, 5).map((song) => (
                <div key={song.id} className="group cursor-pointer" onClick={() => playSong(song)}>
                  <div className="aspect-square relative mb-2">
                    <Image
                      src={song.coverArt}
                      alt={song.title}
                      fill
                      className="rounded-lg object-cover group-hover:brightness-75 transition-all"
                    />
                  </div>
                  <p className="font-semibold text-sm truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hasPlaylists && !hasHistory && <EmptyLibrary />}

      </div>
    </AppShell>
  );
}
