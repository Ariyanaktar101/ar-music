'use client';

import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LogIn, UserPlus, Instagram, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function LoggedInView() {
  const { user, logout } = useAuth();

  return (
     <Card className="w-full max-w-md animate-in fade-in-50 zoom-in-95">
        <CardHeader className="text-center items-center">
             <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user?.name}`} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold font-headline">
                Welcome, {user?.name}!
            </CardTitle>
            <CardDescription className="text-md text-muted-foreground pt-2">
                You are now logged in. Enjoy the music!
            </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center gap-4 px-6 pt-4">
            <Button onClick={logout} variant="secondary" className="w-full">
                <LogOut />
                Log Out
            </Button>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-center text-sm text-muted-foreground pt-6">
              <p>App created by Ariyan</p>
              <a href="https://www.instagram.com/ariyan.xlx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
                ariyan.xlx
              </a>
        </CardFooter>
     </Card>
  )
}

function GuestView() {
  return (
    <Card className="w-full max-w-md animate-in fade-in-50 zoom-in-95">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">
          Join the Music
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground pt-2">
          Sign up or log in to save your favorite songs and create playlists.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center gap-4 px-6 pt-4">
        <Button asChild className="w-full">
          <Link href="/login">
            <LogIn />
            Log In
          </Link>
        </Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/signup">
            <UserPlus />
            Sign Up
          </Link>
        </Button>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-center text-sm text-muted-foreground pt-6">
          <p>App created by Ariyan</p>
          <a href="https://www.instagram.com/ariyan.xlx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
            <Instagram className="h-4 w-4" />
            ariyan.xlx
          </a>
      </CardFooter>
    </Card>
  )
}

export default function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center h-full">
        {user ? <LoggedInView /> : <GuestView />}
      </div>
    </AppShell>
  );
}
