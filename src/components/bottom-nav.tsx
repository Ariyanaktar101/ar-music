'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusicPlayer } from '@/context/MusicPlayerContext';

export function BottomNavBar() {
  const pathname = usePathname();
  const { currentSong } = useMusicPlayer();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/library', label: 'Library', icon: Library },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t z-50">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-center gap-1 p-2 rounded-md transition-colors w-full h-full',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
