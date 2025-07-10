'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const thoughts = {
    morning: "Music is the sunrise of the soul. What will you discover today?",
    afternoon: "Keep the rhythm going. Your perfect afternoon soundtrack awaits.",
    evening: "Unwind and let the music of the night take over."
};

export function GreetingHeader() {
  const [greeting, setGreeting] = useState('');
  const [thought, setThought] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateGreetingAndTime = () => {
      const date = new Date();
      const hours = date.getHours();

      if (hours < 12) {
        setGreeting('Good Morning');
        setThought(thoughts.morning);
      } else if (hours < 18) {
        setGreeting('Good Afternoon');
        setThought(thoughts.afternoon);
      } else {
        setGreeting('Good Evening');
        setThought(thoughts.evening);
      }

      setTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    };

    updateGreetingAndTime();
    const timerId = setInterval(updateGreetingAndTime, 60000); // Update every minute

    return () => clearInterval(timerId);
  }, []);

  if (!greeting || !time) {
    return (
      <div className="relative mb-8 h-16">
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
        <h1 className="text-3xl font-bold font-headline tracking-tight">{greeting}</h1>
        <p className="text-muted-foreground mt-1">{thought}</p>
      </div>
      <div className="absolute top-1 right-1 flex items-center gap-1 text-xs text-muted-foreground font-medium">
        <Clock className="h-3 w-3" />
        <span>{time}</span>
      </div>
    </div>
  );
}
