
'use server';

import type { Song } from '@/lib/types';
import { mapSaavnSongToSong } from '@/lib/jiosaavn-api';

export async function handleSearch(query: string, limit: number = 20): Promise<Song[]> {
  if (!query) return [];
  try {
    const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await response.json();
    
    if (data.success && data.data.results.length > 0) {
      const mappedSongs = data.data.results
        .map(mapSaavnSongToSong)
        .filter((s: Song | null): s is Song => s !== null);
      return mappedSongs;
    }

  } catch (error) {
    console.error('Error searching Saavn API:', error);
  }
  return [];
}
