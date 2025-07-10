
'use client';

import { AppShell } from '@/components/app-shell';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Clock, Plus, Library as LibraryIcon, ChevronRight, Music, Download } from 'lucide-react';
import Link from 'next/link';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

function QuickAccessCard({ icon: Icon, title, subtitle, href, variant }: { icon: React.ElementType, title: string, subtitle: string, href: string, variant: 'primary' | 'secondary' | 'accent' }) {
    return (
        <Link href={href}>
            <Card className="p-3 hover:bg-secondary/80 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-md flex items-center justify-center",
                        variant === 'primary' && 'bg-primary text-primary-foreground',
                        variant === 'secondary' && 'bg-muted text-muted-foreground',
                        variant === 'accent' && 'bg-accent text-accent-foreground'
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

function CreatePlaylistDialog({ children }: { children: React.ReactNode }) {
    const { createPlaylist } = useMusicPlayer();
    const router = useRouter();
    const [playlistName, setPlaylistName] = useState('');

    const handleCreatePlaylist = () => {
        if (!playlistName.trim()) return;
        const newPlaylist = createPlaylist(playlistName);
        router.push(`/playlist/${newPlaylist.id}`);
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Playlist</DialogTitle>
                    <DialogDescription>Give your playlist a name.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="playlist-name">Playlist Name</Label>
                    <Input 
                        id="playlist-name" 
                        placeholder="My Awesome Mix" 
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                         <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleCreatePlaylist} disabled={!playlistName.trim()}>
                            Create
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
            <CreatePlaylistDialog>
                 <Button size="lg" className="rounded-full mt-4">
                    <Plus className="mr-2" /> Create Your First Playlist
                </Button>
            </CreatePlaylistDialog>
        </div>
    )
}

export default function LibraryPage() {
    const { favoriteSongs, recentlyPlayed, playlists, playSong, downloadedSongs } = useMusicPlayer();

    const hasPlaylists = playlists.length > 0;
    const hasHistory = recentlyPlayed.length > 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                Your Library
                </h1>
                <p className="text-muted-foreground mt-1">Your playlists and saved music</p>
            </div>
             <CreatePlaylistDialog>
                <Button variant="outline" size="icon" className="shrink-0">
                    <Plus />
                </Button>
            </CreatePlaylistDialog>
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
                icon={Download}
                title="Downloads"
                subtitle={`${downloadedSongs.length} songs`}
                href="/library/downloads"
                variant="accent"
            />
            <QuickAccessCard 
                icon={Clock}
                title="Recently Played"
                subtitle={`${recentlyPlayed.length} songs`}
                href="/library/recent"
                variant="secondary"
            />
        </div>
        
        {hasPlaylists && (
             <section>
                <h2 className="text-xl font-bold font-headline tracking-tight mb-4">Your Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {playlists.map((playlist) => (
                    <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="group cursor-pointer">
                        <div className="aspect-square relative mb-2">
                             <Card className="w-full h-full flex items-center justify-center bg-muted group-hover:bg-secondary">
                                {playlist.coverArt ? (
                                <Image
                                    src={playlist.coverArt}
                                    alt={playlist.name}
                                    fill
                                    className="rounded-lg object-cover group-hover:brightness-75 transition-all"
                                />
                                ) : (
                                    <Music className="h-1/2 w-1/2 text-muted-foreground" />
                                )}
                             </Card>
                        </div>
                        <p className="font-semibold text-sm truncate">{playlist.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{playlist.songIds.length} songs</p>
                    </Link>
                ))}
                </div>
            </section>
        )}

        {hasHistory && !hasPlaylists && (
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
