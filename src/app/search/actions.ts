
'use server';

import type { Song } from '@/lib/types';
import { getSpotifyAccessToken, mapSpotifyTrackToSong } from '@/lib/spotify-api';

export async function handleSearch(query: string, limit: number = 20): Promise<Song[]> {
  if (!query) return [];
  
  try {
    const token = await getSpotifyAccessToken();
    if (!token) {
        throw new Error("Could not authenticate with Spotify.");
    }
    
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.error('Error searching Spotify API:', await response.text());
        return [];
    }

    const data = await response.json();
    
    if (data.tracks && data.tracks.items) {
        const mappedSongs = data.tracks.items
            .map(mapSpotifyTrackToSong)
            .filter((s: Song | null): s is Song => s !== null && s.url); // Ensure we have a preview URL
        return mappedSongs;
    }

  } catch (error) {
    console.error('Error in handleSearch:', error);
  }
  return [];
}
