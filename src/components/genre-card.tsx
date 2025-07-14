
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GenreCardProps {
  genre: string;
  imageUrl: string;
  dataAiHint: string;
  className?: string;
}

export function GenreCard({ genre, imageUrl, dataAiHint, className }: GenreCardProps) {
  return (
    <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
        <Link href={`/search?genre=${encodeURIComponent(genre)}`} className={cn("group block aspect-square relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow", className)}>
            <Image
                src={imageUrl}
                alt={genre}
                data-ai-hint={dataAiHint}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">{genre}</h3>
            </div>
        </Link>
    </motion.div>
  );
}
