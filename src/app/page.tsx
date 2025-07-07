import { AppShell } from '@/components/app-shell';
import { searchSongs } from '@/lib/api';
import { SongCard } from '@/components/song-card';
import { SongList } from '@/components/song-list';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 
  'Bollywood', 'Punjabi', 'Lofi', 'Workout'
];

const genreGradients = [
    'from-chart-1 to-chart-2', 'from-chart-2 to-chart-3', 'from-chart-3 to-chart-4',
    'from-chart-4 to-chart-5', 'from-chart-5 to-chart-1', 'from-primary to-accent',
    'from-chart-1 to-primary', 'from-chart-2 to-accent', 'from-chart-3 to-primary',
    'from-chart-4 to-accent', 'from-chart-5 to-primary', 'from-primary to-chart-3'
];

export default async function Home() {
  const trendingSongs = await searchSongs("top 20 songs India", 20);
  const hindiHits = await searchSongs("latest bollywood hits", 12);

  return (
    <AppShell>
      <div className="animate-in fade-in-50 space-y-12">
        <section>
            <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">Welcome to AR Music</h1>
            <p className="text-muted-foreground mt-2 text-lg">
                Discover and enjoy over 10,000 songs from around the world.
            </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold font-headline tracking-tight uppercase mb-4">
            Hindi Hits
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hindiHits.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        <section>
            <h2 className="text-2xl font-semibold font-headline tracking-tight mb-4">
            Browse All
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {genres.map((genre, index) => (
                <Link key={genre} href={`/search?genre=${encodeURIComponent(genre)}`} className="block">
                    <Card 
                        className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${genreGradients[index % genreGradients.length]}`}
                    >
                        <CardContent className="p-4 h-32 flex items-end">
                            <h3 className="font-bold text-xl text-white drop-shadow-md">{genre}</h3>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold font-headline tracking-tight uppercase mb-4">
            Trending Now
          </h2>
          <SongList songs={trendingSongs} />
        </section>
      </div>
    </AppShell>
  );
}
