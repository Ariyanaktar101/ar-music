import { AppShell } from '@/components/app-shell';
import { AlbumCard } from '@/components/album-card';
import { featuredPlaylists, newReleases } from '@/lib/data';

export default function Home() {
  return (
    <AppShell>
      <div className="animate-in fade-in-50">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Browse
        </h1>
        <p className="text-muted-foreground mt-1">
          Discover new music, curated for you.
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold font-headline tracking-tight">
            Featured Playlists
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {featuredPlaylists.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold font-headline tracking-tight">
            New Releases
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {newReleases.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
