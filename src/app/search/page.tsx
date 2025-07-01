import { AppShell } from '@/components/app-shell';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country'
];

const genreColors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

export default function SearchPage() {
  return (
    <AppShell>
      <div className="animate-in fade-in-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for songs, artists, or albums" className="pl-10 text-lg h-14" />
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold font-headline tracking-tight">
            Browse Genres
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
            {genres.map((genre, index) => (
              <Card key={genre} className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${genreColors[index % genreColors.length]}`}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-white">{genre}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
