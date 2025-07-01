"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { mockSong } from '@/lib/data';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setProgress(audio.currentTime);
    };

    const handleSongEnd = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleSongEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleSongEnd);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(console.error);
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);
  
  const handlePlayPauseToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if(audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      const muted = newVolume === 0;
      setIsMuted(muted);
      audioRef.current.muted = muted;
    }
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioRef.current.muted = newMutedState;
    if (!newMutedState && volume === 0) {
      const newVolume = 50;
      setVolume(newVolume);
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };
  
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-background/80 backdrop-blur-md border-t z-50">
       <audio ref={audioRef} src={mockSong.url} preload="metadata" />
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
            <Button variant="ghost" size="icon" onClick={handleSkipBack}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full" onClick={handlePlayPauseToggle}>
              {isPlaying ? <Pause className="h-6 w-6 fill-primary-foreground" /> : <Play className="h-6 w-6 fill-primary-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSkipForward}>
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
           <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
