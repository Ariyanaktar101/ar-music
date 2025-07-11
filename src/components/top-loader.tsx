
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function TopLoader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setProgress(0);
    setIsVisible(false);
  }, [pathname, searchParams]);


  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const startLoading = () => {
        setIsVisible(true);
        setProgress(0);
        let currentProgress = 0;

        progressInterval = setInterval(() => {
            currentProgress += Math.random() * 20;
            if (currentProgress > 95) {
                currentProgress = 95;
                clearInterval(progressInterval);
            }
            setProgress(currentProgress);
        }, 200);
    };

    // This is a simplified way to detect navigation start.
    // In a real-world scenario, you might need more complex logic
    // if you're not using Next.js's built-in navigation events.
    // Since we don't have access to router events directly here,
    // we'll simulate the loading start and end based on path changes.
    
    // We can't directly detect the start of navigation in a client component
    // this deep without a layout-level context. A simple workaround is to 
    // show it on every path change and hide it quickly.
    
    startLoading();

    return () => {
        clearInterval(progressInterval);
        clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] pointer-events-none">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))',
          animation: 'shimmer 2s linear infinite',
        }}
      ></div>
    </div>
  );
}
