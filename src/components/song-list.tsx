
'use client'

import Image from 'next/image'
import type { Song } from '@/lib/types'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { Play, Pause } from 'lucide-react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import React from 'react'
import { motion } from 'framer-motion'

interface SongListProps {
    songs: Song[]
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

export const SongList = React.memo(function SongList({ songs }: SongListProps) {
    const { playSong, currentSong, isPlaying } = useMusicPlayer()

    const handlePlay = (song: Song) => {
        playSong(song, songs)
    }

    return (
        <Table>
            <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {songs.map((song, index) => {
                    const isThisSongPlaying = currentSong?.id === song.id && isPlaying;
                    const isThisCurrentSong = currentSong?.id === song.id;
                    return (
                        <motion.tr
                            key={song.id}
                            variants={itemVariants}
                            onClick={() => handlePlay(song)}
                            className={cn(
                                "cursor-pointer group border-b-0",
                                isThisCurrentSong && "bg-secondary"
                            )}
                            whileHover={{ backgroundColor: 'hsl(var(--secondary))', transition: { duration: 0.2 } }}
                        >
                            <TableCell className="w-10 align-middle text-center text-muted-foreground font-mono text-sm sm:text-base px-1 sm:px-4">
                                <span className="group-hover:hidden">{index + 1}</span>
                                <div className="hidden group-hover:flex items-center justify-center">
                                    {isThisSongPlaying ? (
                                        <Pause className="h-5 w-5 text-primary fill-primary" />
                                    ) : (
                                        <Play className="h-5 w-5 text-primary fill-primary" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="p-2 align-middle">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-11 w-11 flex-shrink-0">
                                        <Image
                                            src={song.coverArt}
                                            alt={song.title}
                                            fill
                                            className="rounded-md object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className={cn("font-semibold truncate", isThisCurrentSong && "text-primary")}>{song.title}</p>
                                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground align-middle truncate">{song.album}</TableCell>
                            <TableCell className="text-right text-muted-foreground align-middle font-mono text-sm pr-2 sm:pr-4">{song.duration}</TableCell>
                        </motion.tr>
                    )
                })}
            </motion.tbody>
        </Table>
    )
})
