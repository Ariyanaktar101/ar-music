'use client';

import React, { useRef, useEffect } from 'react';
import { useMusicPlayer } from '@/context/MusicPlayerContext';

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyser } = useMusicPlayer();
  const animationFrameId = useRef<number>();

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const cols = 16;
    const rows = 10;
    const blockWidth = canvas.width / cols;
    const blockHeight = canvas.height / rows;
    const gap = 4;

    const renderFrame = () => {
      animationFrameId.current = requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const index = (i + j * cols) % bufferLength;
          const value = dataArray[index];
          const amp = value / 255;
          
          const r = amp * 195;         // Purple: C300FF -> (195, 0, 255)
          const g = amp * 194;         // Blue:   00C2FF -> (0, 194, 255)
          const b = 255;

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          
          // Glow effect
          ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
          ctx.shadowBlur = amp * 20;

          const barHeight = amp * blockHeight * 1.5;
          const barWidth = blockWidth - gap;
          
          const x = i * blockWidth + gap / 2;
          const y = j * blockHeight + (blockHeight - barHeight) / 2;

          ctx.fillRect(x, y, barWidth, barHeight);
        }
      }
      // Reset shadow for next frame
      ctx.shadowBlur = 0;
    };

    renderFrame();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [analyser]);

  return <canvas ref={canvasRef} className="w-full h-full bg-black rounded-lg" />;
};

export default AudioVisualizer;
