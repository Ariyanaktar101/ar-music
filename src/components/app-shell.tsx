"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Home, Search, Library, Plus, Heart, Music } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const buttonBaseClasses = 'justify-start w-full text-base font-medium rounded-lg transition-colors';
  const activeClasses = 'bg-primary text-primary-foreground hover:bg-primary/90';
  const inactiveClasses = 'hover:bg-accent/50 text-muted-foreground hover:text-foreground';

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar className="w-64 border-r flex flex-col bg-card">
          <SidebarHeader className="p-4 border-b">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Music className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-tight">AR MUSIC</span>
                <span className="text-xs text-muted-foreground -mt-1">by ariyan</span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="flex-1 flex flex-col mt-4 px-4">
            <div className="space-y-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/'}
                    className={cn(buttonBaseClasses, pathname === '/' ? activeClasses : inactiveClasses)}
                  >
                    <Link href="/"><Home className="h-5 w-5" /> Home</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/search'}
                    className={cn(buttonBaseClasses, pathname === '/search' ? activeClasses : inactiveClasses)}
                  >
                    <Link href="/search"><Search className="h-5 w-5" /> Search</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/library'}
                    className={cn(buttonBaseClasses, pathname === '/library' ? activeClasses : inactiveClasses)}
                  >
                    <Link href="/library"><Library className="h-5 w-5" /> Your Library</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <div className="mt-6 space-y-1">
               <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Stuff</h3>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={cn(buttonBaseClasses, inactiveClasses)}>
                    <Link href="#"><Plus className="h-5 w-5" /> Create Playlist</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={cn(buttonBaseClasses, inactiveClasses)}>
                    <Link href="#"><Heart className="h-5 w-5" /> Liked Songs</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

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

          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-auto">
          <main className="flex-1 p-6 pb-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          <MusicPlayer />
        </div>
      </div>
    </SidebarProvider>
  );
}
