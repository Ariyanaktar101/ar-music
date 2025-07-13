
'use server';

import type { Song } from '@/lib/types';
import YTMusic from 'ytmusic-api';

function mapYouTubeSongToSong(ytSong: any): Song | null {
  try {
    // Check if the item is a valid song
    if (ytSong.type !== 'song' || !ytSong.videoId) {
      return null;
    }

    const videoId = ytSong.videoId;
    const title = ytSong.name;
    const artist = ytSong.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist';
    const album = ytSong.album?.name || 'Unknown Album';
    const durationText = ytSong.duration_seconds 
      ? new Date(ytSong.duration_seconds * 1000).toISOString().substr(14, 5)
      : '0:00';
    
    // The library provides thumbnails, find the best quality one
    const thumbnails = ytSong.thumbnails || [];
    const coverArt = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : 'https://placehold.co/500x500.png';

    return {
      id: videoId,
      title: title || 'Unknown Title',
      artist,
      album,
      duration: durationText,
      coverArt: coverArt,
      // IMPORTANT: This URL is not a direct audio stream. It's a link to the video.
      // The player will not be able to play this.
      url: `https://music.youtube.com/watch?v=${videoId}`,
    };
  } catch (error) {
    console.error("Error mapping YouTube song:", error, ytSong);
    return null;
  }
}

export async function handleSearch(query: string, limit: number = 20): Promise<Song[]> {
  if (!query) return [];
  try {
    const ytmusic = new YTMusic();
    await ytmusic.initialize();

    const results = await ytmusic.search(query, { filter: 'songs', limit });
    
    if (results.content && results.content.length > 0) {
      const mappedSongs = results.content
        .map(mapYouTubeSongToSong)
        .filter((s: Song | null): s is Song => s !== null);
      return mappedSongs;
    }

  } catch (error) {
    console.error('Error searching YouTube Music API:', error);
  }
  return [];
}
