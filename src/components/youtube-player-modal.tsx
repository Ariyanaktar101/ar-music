
'use client';

import React from 'react';
import YouTube from 'react-youtube';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface YouTubePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

export function YouTubePlayerModal({ isOpen, onClose, videoId, title }: YouTubePlayerModalProps) {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 border-0 bg-black">
        <div className="aspect-video w-full">
           <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
        </div>
        <DialogHeader className="p-4 pt-2 text-left">
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-black/50 text-white hover:bg-black/70">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
