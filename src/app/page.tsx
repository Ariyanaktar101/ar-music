import { AppShell } from '@/components/app-shell';
import { searchSongs } from '@/lib/api';
import { SongList } from '@/components/song-list';

export default async function Home() {
  const trendingSongs = await searchSongs("trending indian songs", 20);

  return (
    <AppShell>
      <div className="animate-in fade-in-50">
        <section>
          <h2 className="text-2xl font-semibold font-headline tracking-tight uppercase mb-4">
            Trending Now - Top 20
          </h2>
          <SongList songs={trendingSongs} />
        </section>
      </div>
    </AppShell>
  );
}
