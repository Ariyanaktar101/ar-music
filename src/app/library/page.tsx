import { AppShell } from '@/components/app-shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Mic2, DiscAlbum } from 'lucide-react';
import Link from 'next/link';

export default function LibraryPage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Your Library
        </h1>
        
        <Tabs defaultValue="artists" className="mt-6">
          <TabsList>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
          </TabsList>
          <TabsContent value="artists" className="mt-6">
            <div className="text-center bg-card p-10 border-2 border-dashed rounded-lg flex flex-col items-center">
                <div className="p-4 bg-muted rounded-full">
                    <Mic2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">No Followed Artists Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">When you follow an artist, you'll see them here.</p>
                <Button asChild className="mt-6">
                    <Link href="/search">Find Artists</Link>
                </Button>
            </div>
          </TabsContent>
          <TabsContent value="albums" className="mt-6">
            <div className="text-center bg-card p-10 border-2 border-dashed rounded-lg flex flex-col items-center">
                <div className="p-4 bg-muted rounded-full">
                    <DiscAlbum className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">No Saved Albums Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">When you save an album, you'll see it here.</p>
                <Button asChild className="mt-6">
                    <Link href="/">Browse Music</Link>
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
