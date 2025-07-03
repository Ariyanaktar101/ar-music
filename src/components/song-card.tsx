"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Song } from '@/lib/types';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { Play, Pause } from 'lucide-react';

interface SongCardProps {
  song: Song;
}

export function SongCard({ song }: SongCardProps) {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const isThisSongPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSong(song);
  };

  return (
    <div
      onClick={handlePlay}
      className="group cursor-pointer"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <Image
              src={song.coverArt}
              alt={song.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isThisSongPlaying ? (
                <Pause className="h-12 w-12 text-white fill-white" />
              ) : (
                <Play className="h-12 w-12 text-white fill-white" />
              )}
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm truncate">{song.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
