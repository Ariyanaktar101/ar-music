"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MusicPlayer } from '@/components/music-player';
import { Home, Search, Library, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { BottomNavBar } from '@/components/bottom-nav';
import { ScrollArea } from './ui/scroll-area';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentSong, playlists } = useMusicPlayer();

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary-foreground"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground tracking-tight">AR MUSIC</span>
                    <span className="text-xs text-muted-foreground -mt-1">by ariyan</span>
                </div>
                </Link>
            </header>
            <div className="flex-1 flex flex-col mt-4 px-2 overflow-y-auto">
                {/* Navigation */}
                <nav className="space-y-1 px-2">
                    <Link href="/" className={cn(buttonBaseClasses, pathname === '/' ? activeClasses : inactiveClasses)}>
                        <Home className="h-5 w-5" /> <span>Home</span>
                    </Link>
                    <Link href="/search" className={cn(buttonBaseClasses, pathname.startsWith('/search') ? activeClasses : inactiveClasses)}>
                        <Search className="h-5 w-5" /> <span>Search</span>
                    </Link>
                    <Link href="/library" className={cn(buttonBaseClasses, pathname.startsWith('/library') ? activeClasses : inactiveClasses)}>
                        <Library className="h-5 w-5" /> <span>Your Library</span>
                    </Link>
                    <Link href="/profile" className={cn(buttonBaseClasses, pathname === '/profile' ? activeClasses : inactiveClasses)}>
                        <User className="h-5 w-5" /> <span>Profile</span>
                    </Link>
                </nav>

                <div className="mt-auto flex flex-col">
                  <ScrollArea className="flex-1 h-[30vh]">
                    <div className="p-2 space-y-1">
                      <h3 className="px-2 mb-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Playlists</h3>
                      {playlists.map(playlist => (
                         <Link key={playlist.id} href={`/playlist/${playlist.id}`} className={cn(buttonBaseClasses, pathname === `/playlist/${playlist.id}` ? 'text-primary' : 'text-muted-foreground', "text-sm p-2")}>
                          <span className="truncate">{playlist.name}</span>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
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
