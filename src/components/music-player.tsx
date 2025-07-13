

"use client";

import React from 'react';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Heart, ChevronDown, Shuffle, Repeat, Mic2, Loader, Music, MoreVertical, PlusSquare, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { motion, PanInfo, useAnimation } from 'framer-motion';

function MoreOptionsButton() {
    const { currentSong, playlists, addSongToPlaylist, toggleLyricsView, downloadSong } = useMusicPlayer();

    if (!currentSong) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <PlusSquare className="mr-2 h-4 w-4" />
                        <span>Add to Playlist</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                             <DropdownMenuLabel>Select Playlist</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             {playlists.length > 0 ? (
                                playlists.map(playlist => (
                                    <DropdownMenuItem key={playlist.id} onClick={() => addSongToPlaylist(playlist.id, currentSong)}>
                                        {playlist.name}
                                    </DropdownMenuItem>
                                ))
                             ) : (
                                <DropdownMenuItem disabled>No playlists yet</DropdownMenuItem>
                             )}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={toggleLyricsView}>
                    <Mic2 className="mr-2 h-4 w-4" />
                    <span>View Lyrics</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => downloadSong(currentSong)}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


function ExpandedPlayer() {
  const { 
    currentSong, 
    isPlaying, 
    togglePlayPause, 
    progress, 
    duration, 
    handleProgressChange,
    skipForward, 
    skipBackward, 
    isFavorite, 
    toggleFavorite,
    isExpanded,
    toggleExpandPlayer,
    closePlayer,
    volume,
    isMuted,
    handleVolumeChange,
    handleMuteToggle,
    showLyrics,
    lyrics,
    loadingLyrics,
    toggleLyricsView,
    currentLineIndex,
    isShuffled,
    toggleShuffle,
  } = useMusicPlayer();
  
  const controls = useAnimation();
  const lyricsContainerRef = React.useRef<HTMLDivElement>(null);
  const activeLyricRef = React.useRef<HTMLDivElement>(null);


  if (!currentSong) return null;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragDistance = info.offset.y;
    const velocity = info.velocity.y;

    if (dragDistance > window.innerHeight / 4 || velocity > 500) {
      closePlayer();
    } else {
      controls.start({ y: 0, transition: { type: 'spring', damping: 30, stiffness: 250 } });
    }
  };


  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const currentSongIsFavorite = isFavorite(currentSong.id);
  const lyricsLines = React.useMemo(() => lyrics?.split('\n').filter(line => line.trim() !== '') || [], [lyrics]);
    
  React.useEffect(() => {
    if (isExpanded) {
        controls.start({ y: 0 });
    } else {
        controls.start({ y: '100%' });
    }
  }, [isExpanded, controls]);

  React.useEffect(() => {
    if (showLyrics && activeLyricRef.current && lyricsContainerRef.current) {
        const container = lyricsContainerRef.current;
        const activeLine = activeLyricRef.current;
        const containerHeight = container.clientHeight;
        const activeLineTop = activeLine.offsetTop;
        const activeLineHeight = activeLine.clientHeight;

        container.scrollTo({
            top: activeLineTop - containerHeight / 2 + activeLineHeight / 2,
            behavior: 'smooth',
        });
    }
  }, [currentLineIndex, showLyrics]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };
  
  const renderPlayerContent = () => {
    if (showLyrics) {
      return (
        <div className="absolute inset-0 bg-background flex flex-col items-center justify-center text-center rounded-lg overflow-hidden">
            {loadingLyrics ? (
            <Loader className="h-10 w-10 animate-spin text-primary" />
            ) : lyricsLines.length > 0 ? (
                <div 
                    ref={lyricsContainerRef}
                    className="w-full h-full overflow-y-auto p-8 scroll-smooth"
                >
                    <div className="flex flex-col gap-4 text-2xl font-bold">
                        {lyricsLines.map((line, index) => (
                        <div
                            key={index}
                            ref={currentLineIndex === index ? activeLyricRef : null}
                            className={cn(
                            "transition-all duration-300",
                            currentLineIndex === index
                                ? "text-foreground scale-105"
                                : "text-muted-foreground opacity-50"
                            )}
                        >
                            {line || '...'}
                        </div>
                        ))}
                    </div>
                </div>
            ) : (
            <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                <Music className="h-8 w-8" />
                <p className="font-medium">No lyrics found</p>
                <p className="text-sm">Sorry, we couldn't find lyrics for this song.</p>
            </div>
            )}
        </div>
      );
    }
    return (
        <motion.div 
            className="relative w-full h-full rounded-lg shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
        >
            <Image
                src={currentSong.coverArt}
                alt={currentSong.title}
                fill
                className="object-cover rounded-lg"
            />
             <div className="absolute inset-0 animate-aurora-glow rounded-lg" />
        </motion.div>
    );
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-background z-[60] flex flex-col md:hidden"
      initial={{ y: '100%' }}
      animate={controls}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-shrink-0 p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={toggleExpandPlayer}>
          <ChevronDown className="h-6 w-6" />
        </Button>
        <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Playing from Album</p>
            <p className="font-bold truncate">{currentSong.album}</p>
        </div>
         <MoreOptionsButton />
      </div>

      <motion.div 
        className="flex-1 flex flex-col justify-center items-center px-8 gap-6 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate={isExpanded ? "visible" : "hidden"}
      >
        <motion.div className="relative w-full max-w-sm aspect-square" variants={itemVariants}>
          {renderPlayerContent()}
        </motion.div>

        <motion.div className="w-full" variants={itemVariants}>
          <div className="flex justify-between items-center">
            <div className="flex-1 text-left overflow-hidden">
              <h2 className="text-2xl font-bold truncate">{currentSong.title}</h2>
              <p className="text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => toggleFavorite(currentSong.id)}>
              <Heart className={cn("h-6 w-6", currentSongIsFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            </Button>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
         className="flex-shrink-0 px-6 pb-6 space-y-3"
         variants={itemVariants}
         initial="hidden"
         animate={isExpanded ? "visible" : "hidden"}
      >
        <div className="space-y-1 relative">
            <Slider
                value={[progress]}
                max={duration}
                step={1}
                onValueChange={handleProgressChange}
                className="w-full h-1 relative [&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-accent [&>a]:h-3 [&>a]:w-3 [&>a]:bg-white"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        <div className="flex items-center justify-around">
            <Button variant="ghost" size="icon" onClick={toggleShuffle}>
                <Shuffle className={cn("h-5 w-5", isShuffled ? "text-primary" : "text-muted-foreground")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={skipBackward}>
                <SkipBack className="h-6 w-6" />
            </Button>
            <Button size="icon" className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-7 w-7 fill-primary-foreground" /> : <Play className="h-7 w-7 fill-primary-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={skipForward}>
                <SkipForward className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
                <Repeat className="h-5 w-5 text-muted-foreground" />
            </Button>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
             <Button variant="ghost" size="icon" onClick={handleMuteToggle}>
                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5 text-muted-foreground" /> : <Volume2 className="h-5 w-5 text-muted-foreground" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-full h-1 relative [&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-white/40 [&>a]:h-3 [&>a]:w-3"
            />
             <Button variant="ghost" size="icon" onClick={toggleLyricsView} className={cn(showLyrics && "text-primary")}>
                <Mic2 className="h-5 w-5" />
            </Button>
        </div>
         <div className="flex items-center justify-center pt-1">
            <p className="text-center font-display text-muted-foreground text-lg">
                designed by ariyan
            </p>
         </div>
      </motion.div>
    </motion.div>
  )
}

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
    toggleFavorite,
    toggleExpandPlayer,
    showLyrics,
    toggleLyricsView,
    isShuffled,
    toggleShuffle,
  } = useMusicPlayer();
  
  const compactPlayerControls = useAnimation();

  const handleCompactPlayerDragEnd = (event: React.MouseEvent | React.TouchEvent | React.PointerEvent, info: PanInfo) => {
    const dragDistance = info.offset.y;
    const velocity = info.velocity.y;

    // If dragged down by a significant amount or with high velocity
    if (dragDistance > 60 || velocity > 500) {
      compactPlayerControls.start({ y: "100%", transition: { type: 'tween', ease: 'easeInOut', duration: 0.3 } }).then(() => {
        closePlayer();
        // Reset position for next time it opens
        compactPlayerControls.set({ y: 0 }); 
      });
    } else {
      // Snap back to original position
      compactPlayerControls.start({ y: 0, transition: { type: 'spring', damping: 30, stiffness: 250 } });
    }
  };

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

  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

  return (
    <>
      {/* Expanded Mobile Player */}
      <ExpandedPlayer />

      {/* Mobile Player */}
       <motion.div 
        animate={compactPlayerControls}
        drag="y"
        onDragEnd={handleCompactPlayerDragEnd}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        className="md:hidden fixed bottom-16 left-0 right-0 h-auto bg-background/90 backdrop-blur-md border-t z-50"
        style={{ touchAction: 'pan-y' }}
       >
         <div className="flex flex-col p-2 gap-2" onClick={toggleExpandPlayer}>
             <div className="flex items-center gap-3">
                <Image
                    src={currentSong.coverArt}
                    alt={currentSong.title}
                    width={40}
                    height={40}
                    className="rounded-md flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-center overflow-hidden">
                    <p className="font-semibold truncate text-sm">{currentSong.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
                </div>
                <div className="flex items-center" onClick={stopPropagation}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0" onClick={() => toggleFavorite(currentSong.id)}>
                        <Heart className={cn("h-5 w-5", currentSongIsFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0" onClick={togglePlayPause}>
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <MoreOptionsButton />
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="text-[10px]">{formatTime(progress)}</span>
                <Slider
                    value={[progress]}
                    max={duration}
                    step={1}
                    onValueChange={(value) => handleProgressChange(value)}
                    onClick={stopPropagation}
                    onTouchStart={stopPropagation}
                    className="w-full h-1 relative [&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-accent [&>a]:h-2.5 [&>a]:w-2.5"
                />
                <span className="text-[10px]">{formatTime(duration)}</span>
            </div>
        </div>
      </motion.div>


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
               <Button variant="ghost" size="icon" onClick={toggleShuffle}>
                <Shuffle className={cn("h-5 w-5", isShuffled ? "text-primary" : "text-muted-foreground")} />
              </Button>
              <Button variant="ghost" size="icon" onClick={skipBackward}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button size="icon" className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-6 w-6 fill-primary-foreground" /> : <Play className="h-6 w-6 fill-primary-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={skipForward}>
                <SkipForward className="h-5 w-5" />
              </Button>
               <Button variant="ghost" size="icon">
                <Repeat className="h-5 w-5 text-muted-foreground" />
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
             <Button variant="ghost" size="icon" onClick={toggleLyricsView} className={cn(showLyrics && "text-primary")}>
                <Mic2 className="h-5 w-5" />
            </Button>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                        {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2 mb-2">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-full h-1 relative [&>span:first-child]:h-1 [&>span>span]:h-1 [&>span>span]:bg-white [&>a]:h-3 [&>a]:w-3"
                    />
                </PopoverContent>
            </Popover>
            <MoreOptionsButton />
             <Button variant="ghost" size="icon" onClick={closePlayer}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
