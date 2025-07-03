"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { MusicPlayer } from '@/components/music-player';
import { Home, Search as SearchIcon, Library, Plus, Heart, LogIn, UserPlus, Settings, History } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/search');
    }
  };


  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar className="w-64 border-r flex flex-col bg-card">
          <SidebarHeader className="p-4">
            <Link href="/" className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">AR MUSIC</span>
              <span className="text-xs text-muted-foreground mt-1">created by ariyan</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="flex-1 flex flex-col mt-2 px-2">
            <div className="space-y-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/'}
                    className={cn(
                      'justify-start w-full text-base font-medium',
                      pathname === '/'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary hover:bg-secondary/80'
                    )}
                  >
                    <Link href="/"><Home className="h-5 w-5" /> Home</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/search'}
                    className={cn(
                      'justify-start w-full text-base font-medium',
                      pathname === '/search'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary hover:bg-secondary/80'
                    )}
                  >
                    <Link href="/search"><SearchIcon className="h-5 w-5" /> Search</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/library'}
                    className={cn(
                      'justify-start w-full text-base font-medium',
                      pathname === '/library'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary hover:bg-secondary/80'
                    )}
                  >
                    <Link href="/library"><Library className="h-5 w-5" /> Your Library</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <div className="mt-6 space-y-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="justify-start w-full text-base font-medium bg-secondary hover:bg-secondary/80">
                    <Link href="#"><Plus className="h-5 w-5" /> Create Playlist</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="justify-start w-full text-base font-medium bg-secondary hover:bg-secondary/80">
                    <Link href="#"><Heart className="h-5 w-5" /> Liked Songs</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <div className="mt-auto pb-4">
              <h3 className="px-2 mb-2 mt-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recently Played</h3>
              <div className="space-y-1">
                <Link href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <Image src="https://placehold.co/40x40.png" width={40} height={40} alt="Playlist 1" className="rounded-sm" data-ai-hint="abstract album cover" />
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">Playlist 1</p>
                    <p className="text-xs text-muted-foreground">By AR Music</p>
                  </div>
                </Link>
                <Link href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <Image src="https://placehold.co/40x40.png" width={40} height={40} alt="Playlist 2" className="rounded-sm" data-ai-hint="abstract album cover" />
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">Playlist 2</p>
                    <p className="text-xs text-muted-foreground">By AR Music</p>
                  </div>
                </Link>
              </div>
            </div>

          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between gap-4 px-6 py-3 border-b bg-background/90 backdrop-blur-sm sticky top-0 z-20">
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input name="query" placeholder="Search for artists, songs, or podcasts" className="pl-10" />
              </div>
            </form>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <History className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Settings className="h-5 w-5" />
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/login">
                        <LogIn className="h-4 w-4" /> Login
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">
                        <UserPlus className="h-4 w-4" /> Sign Up
                    </Link>
                </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32">
            {children}
          </main>
          <MusicPlayer />
        </div>
      </div>
    </SidebarProvider>
  );
}
