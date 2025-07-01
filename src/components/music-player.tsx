"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { mockSong } from '@/lib/data';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const songDuration = 225; // in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && progress < songDuration) {
      timer = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 1);
      }, 1000);
    }
    if (progress >= songDuration) {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, progress]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      setVolume(0);
    } else {
      setVolume(50);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-background/80 backdrop-blur-md border-t z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 w-1/4">
          <Image
            src={mockSong.coverArt}
            alt={mockSong.title}
            width={56}
            height={56}
            className="rounded-md"
            data-ai-hint={mockSong.data_ai_hint}
          />
          <div>
            <p className="font-semibold truncate">{mockSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{mockSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-1/2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-6 w-6 fill-primary-foreground" /> : <Play className="h-6 w-6 fill-primary-foreground" />}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
            <Slider
              value={[progress]}
              max={songDuration}
              step={1}
              onValueChange={(value) => setProgress(value[0])}
              className="w-full h-1 relative [&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-accent [&>a]:h-3 [&>a]:w-3 [&>a]:bg-white"
            />
            <span className="text-xs text-muted-foreground">{formatTime(songDuration)}</span>
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
            onValueChange={(value) => {
              setVolume(value[0]);
              if (value[0] > 0) setIsMuted(false);
            }}
            className="w-24 h-1 relative [&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-white [&>a]:h-3 [&>a]:w-3"
          />
        </div>
      </div>
    </div>
  );
}
