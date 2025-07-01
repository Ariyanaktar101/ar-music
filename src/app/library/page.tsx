import { AppShell } from '@/components/app-shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListMusic, Mic2, DiscAlbum } from 'lucide-react';

export default function LibraryPage() {
  return (
    <AppShell>
      <div className="animate-in fade-in-50">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Your Library
        </h1>
        
        <Tabs defaultValue="playlists" className="mt-6">
          <TabsList>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
          </TabsList>
          <TabsContent value="playlists" className="mt-4">
            <Alert>
              <ListMusic className="h-4 w-4" />
              <AlertTitle>No Playlists Yet</AlertTitle>
              <AlertDescription>
                Create your first playlist to see it here.
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="artists" className="mt-4">
            <Alert>
              <Mic2 className="h-4 w-4" />
              <AlertTitle>No Followed Artists Yet</AlertTitle>
              <AlertDescription>
                Follow your favorite artists to see them here.
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="albums" className="mt-4">
            <Alert>
              <DiscAlbum className="h-4 w-4" />
              <AlertTitle>No Saved Albums Yet</AlertTitle>
              <AlertDescription>
                Save your favorite albums to see them here.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
