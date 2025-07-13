
'use client';

import { useState } from 'react';
import type { Song } from '@/lib/types';
import { SongCard } from './song-card';
import { motion } from 'framer-motion';
import { useMusicPlayer } from '@/context/MusicPlayerContext';

const specialSong: Song = {
    id: 'special-song-01',
    title: 'Finding Her (Jana Mere Sawalon Ka Manzar Tu)',
    artist: 'AR Music Exclusive',
    album: 'Single',
    duration: '2:47',
    coverArt: 'https://i.ytimg.com/vi/3Cp2QTBZAFQ/hqdefault.jpg',
    // This URL is a direct audio stream that will work with the player
    url: 'https://aac.saavncdn.com/225/1770163251a3a466a9a8385b546a3648_320.mp4',
    data_ai_hint: 'love emotional',
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function SpecialSong() {
    const { playSong } = useMusicPlayer();

    return (
        <section>
            <h2 className="text-2xl font-bold font-headline tracking-wide uppercase mb-4">
              Specially For You
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
               <motion.div
                    onClick={() => playSong(specialSong, [specialSong])}
                    className="group cursor-pointer"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                    <SongCard song={specialSong} playlist={[specialSong]} />
                </motion.div>
            </div>
        </section>
    )
}
