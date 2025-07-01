import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Album } from '@/lib/data';

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href="#" className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <Image
              src={album.coverArt}
              alt={album.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={album.data_ai_hint}
            />
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm truncate">{album.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{album.artist}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
