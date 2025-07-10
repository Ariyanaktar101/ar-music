"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MusicPlayer } from '@/components/music-player';
import { Home, Search, Library, Plus, Heart, Music, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { BottomNavBar } from '@/components/bottom-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentSong } = useMusicPlayer();

  const buttonBaseClasses = 'flex items-center gap-3 justify-start w-full text-base font-medium rounded-lg transition-colors p-2';
  const activeClasses = 'bg-primary text-primary-foreground hover:bg-primary/90';
  const inactiveClasses = 'hover:bg-accent/50 text-muted-foreground hover:text-foreground';

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 border-r flex-col bg-card shrink-0">
            <header className="p-4 border-b">
                <Link href="/" className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                    <Music className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground tracking-tight">AR MUSIC</span>
                    <span className="text-xs text-muted-foreground -mt-1">by ariyan</span>
                </div>
                </Link>
            </header>
            <div className="flex-1 flex flex-col mt-4 px-4 overflow-y-auto">
                {/* Navigation */}
                <nav className="space-y-1">
                    <Link href="/" className={cn(buttonBaseClasses, pathname === '/' ? activeClasses : inactiveClasses)}>
                        <Home className="h-5 w-5" /> <span>Home</span>
                    </Link>
                    <Link href="/search" className={cn(buttonBaseClasses, pathname === '/search' ? activeClasses : inactiveClasses)}>
                        <Search className="h-5 w-5" /> <span>Search</span>
                    </Link>
                    <Link href="/library" className={cn(buttonBaseClasses, pathname === '/library' ? activeClasses : inactiveClasses)}>
                        <Library className="h-5 w-5" /> <span>Your Library</span>
                    </Link>
                    <Link href="/profile" className={cn(buttonBaseClasses, pathname === '/profile' ? activeClasses : inactiveClasses)}>
                        <User className="h-5 w-5" /> <span>Profile</span>
                    </Link>
                </nav>

                {/* Your Stuff */}
                <div className="mt-6 space-y-1">
                <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Stuff</h3>
                <Link href="#" className={cn(buttonBaseClasses, inactiveClasses)}>
                    <Plus className="h-5 w-5" /> <span>Create Playlist</span>
                </Link>
                <Link href="#" className={cn(buttonBaseClasses, inactiveClasses)}>
                    <Heart className="h-5 w-5" /> <span>Liked Songs</span>
                </Link>
                </div>

                {/* Recently Played */}
                <div className="mt-auto pb-4">
                    <h3 className="px-2 mb-2 mt-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recently Played</h3>
                    <div className="space-y-1">
                        <Link href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                            <Image src="https://placehold.co/40x40.png" width={40} height={40} alt="Playlist 1" className="rounded-md" data-ai-hint="abstract album cover" />
                            <div>
                            <p className="text-sm font-medium text-foreground truncate">Lofi Beats</p>
                            <p className="text-xs text-muted-foreground">Playlist</p>
                            </div>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                            <Image src="https://placehold.co/40x40.png" width={40} height={40} alt="Playlist 2" className="rounded-md" data-ai-hint="neon album cover" />
                            <div>
                            <p className="text-sm font-medium text-foreground truncate">Workout Mix</p>
                            <p className="text-xs text-muted-foreground">Playlist</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto">
            <main className={cn(
                "flex-1 p-4 md:p-6",
                currentSong ? 'pb-28 md:pb-32' : 'pb-20 md:pb-6'
            )}>
              {children}
            </main>
            <MusicPlayer />
            <BottomNavBar />
        </div>
    </div>
  );
}
