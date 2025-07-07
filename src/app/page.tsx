import { AppShell } from '@/components/app-shell';
import { searchSongs } from '@/lib/api';
import { SongCard } from '@/components/song-card';
import { SongList } from '@/components/song-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 
  'Bollywood', 'Punjabi', 'Lofi', 'Workout'
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
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {genres.map((genre) => (
                <CarouselItem key={genre} className="basis-auto">
                    <Button asChild variant="outline" className="rounded-full px-5 py-2 text-sm font-semibold">
                      <Link href={`/search?genre=${encodeURIComponent(genre)}`}>
                        {genre}
                      </Link>
                    </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
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
