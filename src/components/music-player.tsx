"use client";

import React from 'react';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Heart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { cn } from '@/lib/utils';

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
    closePlayer,
    isFavorite,
    toggleFavorite
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
  
  const currentSongIsFavorite = isFavorite(currentSong.id);

  return (
    <>
      <audio ref={audioRef} src={currentSong.url} preload="metadata" />
      
      {/* Mobile Player */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 h-20 bg-background/90 backdrop-blur-md border-t z-50 animate-in slide-in-from-bottom-4">
        <div className="flex flex-col h-full">
            <div className="flex items-center h-full px-2 gap-2">
                <Image
                    src={currentSong.coverArt}
                    alt={currentSong.title}
                    width={48}
                    height={48}
                    className="rounded-md flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-center overflow-hidden">
                    <p className="font-semibold truncate text-sm">{currentSong.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
                </div>
                <div className="flex items-center gap-0">
                    <Button variant="ghost" size="icon" className="w-9 h-9" onClick={skipBackward}>
                        <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-11 h-11" onClick={togglePlayPause}>
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="w-9 h-9" onClick={skipForward}>
                        <SkipForward className="h-5 w-5" />
                    </Button>
                     <Button variant="ghost" size="icon" className="w-9 h-9" onClick={closePlayer}>
                        <X className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>
            <div className="px-3 pb-1 -mt-2">
                 <Slider
                    value={[progress]}
                    max={duration}
                    step={1}
                    onValueChange={handleProgressChange}
                    className="w-full h-1 relative [&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-accent [&>a]:h-2.5 [&>a]:w-2.5 [&>a]:bg-white"
                />
            </div>
        </div>
      </div>

      {/* Desktop Player */}
      <div className="hidden md:fixed bottom-0 left-0 right-0 h-24 bg-background/80 backdrop-blur-md border-t z-50 animate-in slide-in-from-bottom-4 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.5)]">
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
             <Button variant="ghost" size="icon" onClick={() => toggleFavorite(currentSong.id)}>
                <Heart className={cn("h-5 w-5", currentSongIsFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            </Button>
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
    </>
  );
}
