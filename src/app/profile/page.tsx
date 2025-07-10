import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LogIn, UserPlus, Instagram } from 'lucide-react';

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center h-full">
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
      </div>
    </AppShell>
  );
}
