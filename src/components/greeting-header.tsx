'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

type TimeOfDay = 'morning' | 'afternoon' | 'evening';

const thoughts = {
    morning: "Music is the sunrise of the soul. What will you discover today?",
    afternoon: "Keep the rhythm going. Your perfect afternoon soundtrack awaits.",
    evening: "The night is calm and full of stars. Find a song to match."
};

const getGreeting = (timeOfDay: TimeOfDay) => {
    return {
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening"
    }[timeOfDay];
}

export function GreetingHeader() {
  const { user } = useAuth();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);
  const [time, setTime] = useState('');

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
      <div className="relative mb-8 h-20">
        <div className="space-y-2">
            <div className="h-10 w-64 bg-muted rounded-md animate-pulse"></div>
            <div className="h-5 w-96 bg-muted rounded-md animate-pulse"></div>
        </div>
        <div className="absolute top-0 right-0 h-6 w-20 bg-muted rounded-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative mb-8">
      <div>
        <h1 className="text-4xl font-display tracking-tight">
            <span>{getGreeting(timeOfDay)}</span>
        </h1>
        <p className="text-muted-foreground mt-1">{thoughts[timeOfDay]}</p>
      </div>
      <div className="absolute top-1 right-1 flex items-center gap-1 text-xs text-muted-foreground font-medium">
        <span>{time}</span>
      </div>
    </div>
  );
}
