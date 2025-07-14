
'use server';

import type { Song } from '@/lib/types';
import { mapYouTubeVideoToSong } from '@/lib/youtube-api';

export async function handleSearch(query: string, limit: number = 20): Promise<Song[]> {
  if (!query) return [];
  
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error("YouTube API key is missing.");
    // Returning an empty array to prevent app crash
    return [];
  }

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=${limit}&key=${apiKey}`);

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error searching YouTube API:', errorBody);
      return [];
    }

    const data = await response.json();
    
    if (data.items) {
      const mappedSongs = data.items
        .map(mapYouTubeVideoToSong)
        .filter((s: Song | null): s is Song => s !== null);
      return mappedSongs;
    }

  } catch (error) {
    console.error('Error in handleSearch:', error);
  }
  return [];
}
