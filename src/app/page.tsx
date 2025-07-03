import { AppShell } from '@/components/app-shell';
import { SongCard } from '@/components/song-card';
import { searchSongs } from '@/lib/api';
import { SongList } from '@/components/song-list';

export default async function Home() {
  const hindiSongs = await searchSongs("popular hindi", 8);
  const englishSongs = await searchSongs("popular english", 8);
  const featuredPlaylists = await searchSongs("lofi vibes", 8);
  const newReleases = await searchSongs("new releases", 8);
  const trendingSongs = await searchSongs("arijit singh hits", 20);

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
            Hindi Hits
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {hindiSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold font-headline tracking-tight">
            Popular English Songs
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {englishSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold font-headline tracking-tight">
            Featured Playlists
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {featuredPlaylists.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold font-headline tracking-tight">
            New Releases
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {newReleases.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold font-headline tracking-tight">
            Top 20 Trending Songs
          </h2>
          <div className="mt-4">
            <SongList songs={trendingSongs} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
