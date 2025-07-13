
'use client';

import type { Song } from '@/lib/types';
import { SongCard } from './song-card';

const specialSong: Song = {
    id: 'special-song-01',
    title: 'Finding Her (Jana Mere Sawalon Ka Manzar Tu)',
    artist: 'AR Music Exclusive',
    album: 'Single',
    duration: '2:47',
    coverArt: 'https://placehold.co/500x500.png',
    data_ai_hint: 'love emotional',
    url: 'https://www.youtube.com/watch?v=3Cp2QTBZAFQ' // Note: This is a YouTube page URL, not a direct audio stream. This will not play.
};

export function SpecialSong() {
    return (
        <section>
            <h2 className="text-2xl font-bold font-headline tracking-wide uppercase mb-4">
              Specially For You
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <SongCard song={specialSong} playlist={[specialSong]} />
            </div>
        </section>
    )
}
