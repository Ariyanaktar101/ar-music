
'use client';

import { useState } from 'react';
import type { Song } from '@/lib/types';
import { SongCard } from './song-card';
import { YouTubePlayerModal } from './youtube-player-modal';
import { motion } from 'framer-motion';

const specialSong: Song = {
    id: 'special-song-01',
    title: 'Finding Her (Jana Mere Sawalon Ka Manzar Tu)',
    artist: 'AR Music Exclusive',
    album: 'Single',
    duration: '2:47',
    coverArt: 'https://i.ytimg.com/vi/3Cp2QTBZAFQ/hqdefault.jpg',
    data_ai_hint: 'love emotional',
    url: '3Cp2QTBZAFQ'
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function SpecialSong() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // This version of SongCard doesn't use the music player context
    const SpecialSongCard = ({ song, onClick }: { song: Song, onClick: () => void }) => (
       <motion.div
            onClick={onClick}
            className="group cursor-pointer"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <SongCard song={song} playlist={[]} isSpecialCard={true} />
        </motion.div>
    );

    return (
        <section>
            <h2 className="text-2xl font-bold font-headline tracking-wide uppercase mb-4">
              Specially For You
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <SpecialSongCard song={specialSong} onClick={() => setIsModalOpen(true)} />
            </div>

            <YouTubePlayerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                videoId={specialSong.url}
                title={specialSong.title}
            />
        </section>
    )
}
