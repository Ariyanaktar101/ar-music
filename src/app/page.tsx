import { AppShell } from '@/components/app-shell';
import { SongCard } from '@/components/song-card';
import { searchSongs } from '@/lib/api';
import { SongList } from '@/components/song-list';

export default async function Home() {
  const hindiSongs = await searchSongs("latest bollywood hits", 8);
  const englishSongs = await searchSongs("popular english songs", 8);
  const trendingSongs = await searchSongs("trending indian songs", 20);

  const sections = [
    { title: "Hindi Hits", songs: hindiSongs },
    { title: "Popular English Songs", songs: englishSongs },
  ];

  return (
    <AppShell>
      <div className="animate-in fade-in-50">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Browse
        </h1>
        <p className="text-muted-foreground mt-1">
          Discover new music, curated for you.
        </p>

        {sections.map((section, index) => (
          <section 
            key={section.title} 
            className="mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
          >
            <h2 className="text-2xl font-semibold font-headline tracking-tight">
              {section.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
              {section.songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </section>
        ))}

        <section 
          className="mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${sections.length * 100}ms`, animationFillMode: 'backwards' }}
        >
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
