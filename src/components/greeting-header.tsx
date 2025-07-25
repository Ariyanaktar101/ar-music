
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

export const GreetingHeader = React.memo(function GreetingHeader() {
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
});
