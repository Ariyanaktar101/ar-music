'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function GreetingHeader() {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateGreetingAndTime = () => {
      const date = new Date();
      const hours = date.getHours();

      if (hours < 12) {
        setGreeting('Good Morning');
      } else if (hours < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }

      setTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateGreetingAndTime();
    const timerId = setInterval(updateGreetingAndTime, 60000); // Update every minute

    return () => clearInterval(timerId);
  }, []);

  if (!greeting || !time) {
    return (
      <div className="flex justify-between items-center mb-8 h-10">
        <div className="h-10 w-64 bg-muted rounded-md animate-pulse"></div>
        <div className="h-8 w-24 bg-muted rounded-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold font-headline tracking-tight">{greeting}</h1>
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <Clock className="h-5 w-5" />
        <span>{time}</span>
      </div>
    </div>
  );
}
