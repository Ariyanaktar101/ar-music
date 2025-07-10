
'use client';

import { AppShell } from '@/components/app-shell';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Clock, Plus, Library as LibraryIcon } from 'lucide-react';
import Link from 'next/link';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import React from 'react';
import { cn } from '@/lib/utils';

function QuickAccessCard({ icon: Icon, title, subtitle, href, variant }: { icon: React.ElementType, title: string, subtitle: string, href: string, variant: 'primary' | 'secondary' }) {
    return (
        <Link href={href}>
            <Card className="p-3 hover:bg-secondary/80 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-md flex items-center justify-center",
                        variant === 'primary' ? 'bg-primary' : 'bg-muted-foreground/20'
                    )}>
                        <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    </div>
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
    const { favoriteSongs } = useMusicPlayer();

    // Mock data for recently played, as we don't track it yet.
    const recentlyPlayedCount = 8;
    
    // In a real app, you would fetch playlist data here.
    const hasPlaylists = false;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            YOUR LIBRARY
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
            <div className="relative">
                <QuickAccessCard 
                    icon={Clock}
                    title="Recently Played"
                    subtitle={`${recentlyPlayedCount} songs`}
                    href="#"
                    variant="secondary"
                />
                {recentlyPlayedCount > 0 && 
                    <span className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></span>
                }
            </div>
        </div>

        {!hasPlaylists && <EmptyLibrary />}

      </div>
    </AppShell>
  );
}
