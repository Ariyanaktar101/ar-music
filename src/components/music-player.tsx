"use client";

import React from 'react';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/context/MusicPlayerContext';

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    progress,
    duration,
    handleProgressChange,
    audioRef,
    volume,
    isMuted,
    handleVolumeChange,
    handleMuteToggle,
    skipForward,
    skipBackward,
    closePlayer
  } = useMusicPlayer();
  
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-background/80 backdrop-blur-md border-t z-50 animate-in slide-in-from-bottom-4 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.5)]">
      <audio ref={audioRef} src={currentSong.url} preload="metadata" />
      <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 w-1/4">
          <Image
            src={currentSong.coverArt}
            alt={currentSong.title}
            width={56}
            height={56}
            className="rounded-md"
          />
          <div>
            <p className="font-semibold truncate">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-1/2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={skipBackward}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-6 w-6 fill-primary-foreground" /> : <Play className="h-6 w-6 fill-primary-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={skipForward}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="w-full h-1 relative [&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-accent [&>a]:h-3 [&>a]:w-3 [&>a]:bg-white"
            />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-1/4 justify-end">
          <Button variant="ghost" size="icon" onClick={handleMuteToggle}>
            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-24 h-1 relative [&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-white [&>a]:h-3 [&>a]:w-3"
          />
           <Button variant="ghost" size="icon" onClick={closePlayer}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
