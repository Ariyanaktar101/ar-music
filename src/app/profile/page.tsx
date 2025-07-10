import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, LogIn } from 'lucide-react';

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
              Sign up to create playlists, follow artists, and save your favorite songs.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <Link href="/login" legacyBehavior>
              <a className="flex flex-col items-center justify-center p-6 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-center space-y-3">
                <LogIn className="h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold">Log In</h3>
                <p className="text-sm text-muted-foreground">Already have an account? Welcome back!</p>
              </a>
            </Link>
            <Link href="/signup" legacyBehavior>
                <a className="flex flex-col items-center justify-center p-6 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-center space-y-3">
                    <UserPlus className="h-10 w-10 text-primary" />
                    <h3 className="text-lg font-semibold">Sign Up</h3>
                    <p className="text-sm text-muted-foreground">New to AR Music? Create an account to get started.</p>
                </a>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
