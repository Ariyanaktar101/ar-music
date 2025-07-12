
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

    let animationFrameId: number;

    const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const cols = 18;
    const rows = 10;
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const step = Math.floor(bufferLength / (cols * rows));

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            
            const dataIndex = (i * rows + j) * step;
            const barHeight = dataIndex < bufferLength ? dataArray[dataIndex] : 0;
            const intensity = barHeight / 255.0;

            if (intensity > 0.1) {
                const x = i * cellWidth;
                const y = j * cellHeight;

                const blueShade = 150 + intensity * 105;
                
                ctx.shadowColor = `hsl(260, 100%, ${50 + intensity * 25}%)`;
                ctx.shadowBlur = 10 + intensity * 15;
                ctx.fillStyle = `rgba(0, 194, 255, ${intensity * 0.5})`;
                
                ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);
            }
        }
      }
      ctx.shadowBlur = 0;
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
