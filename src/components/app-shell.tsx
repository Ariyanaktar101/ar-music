"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MusicPlayer } from '@/components/music-player';
import { Home, Search, Library, Music } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // In a real app, this would be determined by an auth context
  const [isLoggedIn, setIsLoggedIn] = React.useState(true); 

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar className="w-64 border-r flex flex-col">
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2.5 text-xl font-bold font-headline text-primary px-2">
              <Music className="w-7 h-7" />
              AR Music
            </Link>
          </SidebarHeader>
          <SidebarContent className="flex-1 mt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'}>
                  <Link href="/"><Home />Browse</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/search'}>
                  <Link href="/search"><Search />Search</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/library'}>
                  <Link href="/library"><Library />Your Library</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-3 px-2 h-12">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="person portrait" />
                      <AvatarFallback>AR</AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium">Aarav Sharma</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full"><Link href="/login">Log In</Link></Button>
                <Button variant="outline" asChild className="w-full"><Link href="/signup">Sign Up</Link></Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32">
            {children}
          </main>
          <MusicPlayer />
        </div>
      </div>
    </SidebarProvider>
  );
}
