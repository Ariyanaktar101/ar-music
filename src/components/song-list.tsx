'use client'

import Image from 'next/image'
import type { Song } from '@/lib/types'
import { useMusicPlayer } from '@/context/MusicPlayerContext'
import { Play, Pause } from 'lucide-react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface SongListProps {
    songs: Song[]
}

export function SongList({ songs }: SongListProps) {
    const { playSong, currentSong, isPlaying } = useMusicPlayer()

    const handlePlay = (song: Song) => {
        playSong(song)
    }

    return (
        <Table>
            <TableBody>
                {songs.map((song, index) => {
                    const isThisSongPlaying = currentSong?.id === song.id && isPlaying;
                    return (
                        <TableRow
                            key={song.id}
                            onClick={() => handlePlay(song)}
                            className={cn(
                                "cursor-pointer group border-b-0",
                                currentSong?.id === song.id && "bg-accent/50"
                            )}
                        >
                            <TableCell className="w-10 align-middle text-center text-muted-foreground">{index + 1}</TableCell>
                            <TableCell className="p-2 align-middle">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-11 w-11 flex-shrink-0">
                                        <Image
                                            src={song.coverArt}
                                            alt={song.title}
                                            fill
                                            className="rounded-md object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isThisSongPlaying ? (
                                                <Pause className="h-6 w-6 text-white fill-white" />
                                            ) : (
                                                <Play className="h-6 w-6 text-white fill-white" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold truncate">{song.title}</p>
                                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground align-middle">{song.duration}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
