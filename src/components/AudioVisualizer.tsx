
'use client';

import React, { useRef, useEffect } from 'react';
import { useMusicPlayer } from '@/context/MusicPlayerContext';

const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyser } = useMusicPlayer();

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const cols = 18;
    const rows = 10;
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        
        const r = barHeight + (25 * (i/bufferLength));
        const g = 250 * (i/bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(0, ${barHeight / 2}, ${255 - barHeight})`;
        ctx.shadowColor = `hsl(${barHeight / 2 + 180}, 100%, 50%)`;
        ctx.shadowBlur = 10;
        
        const gridCol = Math.floor((x / canvas.width) * cols);
        const gridRow = Math.floor(Math.random() * rows); // Randomize row for more dynamic feel
        const intensity = barHeight / 255;

        const rectX = gridCol * cellWidth;
        const rectY = gridRow * cellHeight;
        
        ctx.globalAlpha = intensity;
        ctx.fillRect(rectX, rectY, cellWidth - 4, cellHeight - 4);
        
        x += barWidth + 1;
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyser]);

  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" />;
};

export default AudioVisualizer;
