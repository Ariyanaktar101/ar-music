
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Song } from '@/lib/types';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { Play, Pause } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

interface SongCardProps {
  song: Song;
  playlist: Song[];
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const SongCard = React.memo(function SongCard({ song, playlist }: SongCardProps) {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const isThisSongPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSong(song, playlist);
  };

  return (
    <motion.div
      onClick={handlePlay}
      className="group cursor-pointer"
      variants={itemVariants}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Card className="overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <Image
              src={song.coverArt}
              alt={song.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {isThisSongPlaying ? (
                <Pause className="h-12 w-12 text-white fill-white transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <Play className="h-12 w-12 text-white fill-white transition-transform duration-300 group-hover:scale-110" />
              )}
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm truncate">{song.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
