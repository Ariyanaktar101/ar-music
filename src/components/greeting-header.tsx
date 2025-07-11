
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

type TimeOfDay = 'morning' | 'afternoon' | 'evening';

const thoughts = {
    morning: "Start your day bright with beats that lift your soul.",
    afternoon: "Keep the rhythm going. Your perfect afternoon soundtrack awaits.",
    evening: "Slow down the world, let music set the mood."
};

const getGreeting = (timeOfDay: TimeOfDay) => {
    return {
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening"
    }[timeOfDay];
}

function WavingDoraemon() {
    return (
        <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Waving Hand */}
                <g className="origin-center animate-wave-hand" style={{ transformOrigin: '25px 80px' }}>
                     <circle cx="20" cy="85" r="10" fill="#fff" stroke="#000" strokeWidth="1" />
                </g>
                {/* Head */}
                <circle cx="50" cy="50" r="40" fill="#36A9E1" stroke="#000" strokeWidth="2" />
                {/* Face */}
                <circle cx="50" cy="55" r="30" fill="#fff" />
                 {/* Collar */}
                <path d="M25 75 Q50 85 75 75 L 75 80 Q50 90 25 80 Z" fill="#D81E05" stroke="#000" strokeWidth="1.5" />
                <circle cx="50" cy="80" r="5" fill="#F9D900" stroke="#000" strokeWidth="1" />
                {/* Eyes */}
                <ellipse cx="40" cy="40" rx="10" ry="12" fill="#fff" stroke="#000" strokeWidth="1.5" />
                <ellipse cx="60" cy="40" rx="10" ry="12" fill="#fff" stroke="#000" strokeWidth="1.5" />
                <circle cx="42" cy="42" r="3" fill="#000" />
                <circle cx="58" cy="42" r="3" fill="#000" />
                {/* Nose */}
                <circle cx="50" cy="50" r="5" fill="#D81E05" stroke="#000" strokeWidth="1" />
                {/* Mouth Line */}
                <line x1="50" y1="55" x2="50" y2="70" stroke="#000" strokeWidth="1.5" />
                {/* Mouth Smile */}
                <path d="M35 65 Q50 75 65 65" stroke="#000" strokeWidth="1.5" fill="none" />
                {/* Whiskers */}
                <line x1="20" y1="55" x2="35" y2="50" stroke="#000" strokeWidth="1" />
                <line x1="20" y1="60" x2="35" y2="60" stroke="#000" strokeWidth="1" />
                <line x1="20" y1="65" x2="35" y2="70" stroke="#000" strokeWidth="1" />
                <line x1="80" y1="55" x2="65" y2="50" stroke="#000" strokeWidth="1" />
                <line x1="80" y1="60" x2="65" y2="60" stroke="#000" strokeWidth="1" />
                <line x1="80" y1="65" x2="65" y2="70" stroke="#000" strokeWidth="1" />
            </svg>
        </div>
    );
}


export function GreetingHeader() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);
  const [time, setTime] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const updateGreetingAndTime = () => {
      const date = new Date();
      const hours = date.getHours();

      if (hours < 12) {
        setTimeOfDay('morning');
      } else if (hours < 18) {
        setTimeOfDay('afternoon');
      } else {
        setTimeOfDay('evening');
      }

      setTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    };

    updateGreetingAndTime();
    const timerId = setInterval(updateGreetingAndTime, 60000); // Update every minute

    return () => clearInterval(timerId);
  }, []);

  if (!timeOfDay || !time) {
    return (
      <div className="relative mb-8 h-24">
        <div className="space-y-2">
            <div className="h-10 w-64 bg-muted rounded-md animate-pulse"></div>
            <div className="h-5 w-96 bg-muted rounded-md animate-pulse"></div>
             <div className="h-6 w-40 bg-muted rounded-md animate-pulse mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-8 flex items-center gap-4">
      <WavingDoraemon />
      <div>
        <h1 className="text-4xl font-display tracking-tight text-foreground">
            {getGreeting(timeOfDay)}
        </h1>
        <p className="text-muted-foreground mt-1">{thoughts[timeOfDay]}</p>
        <p className="font-display text-muted-foreground mt-2 text-lg">created by ariyan</p>
        <p className="text-xs text-muted-foreground font-medium mt-2">{time}</p>
      </div>
    </div>
  );
}
