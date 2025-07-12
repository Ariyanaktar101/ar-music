
import type { Song } from './types';

// This is the raw type from the JioSaavn API for reference
type JioSong = {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  duration: string;
  primaryArtists:
    | string
    | {
        name: string;
      }[];
  image: {
    quality: string;
    url: string;
  }[];
  downloadUrl: {
    quality:string;
    url:string;
  }[];
};


const SAAVN_API_URL = 'https://saavn.me/api';

function mapSaavnSongToSong(saavnSong: JioSong): Song | null {
  const highQualityUrl = saavnSong.downloadUrl.find(q => q.quality === '320kbps')?.url;
  if (!highQualityUrl) return null;

  const artistString = typeof saavnSong.primaryArtists === 'string' 
      ? saavnSong.primaryArtists 
      : saavnSong.primaryArtists.map(a => a.name).join(', ');

  const formatDuration = (s: string) => {
    const seconds = parseInt(s, 10);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    id: saavnSong.id,
    title: saavnSong.name.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
    artist: artistString.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
    album: saavnSong.album.name.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
    duration: formatDuration(saavnSong.duration),
    coverArt: saavnSong.image.find(q => q.quality === '500x500')?.url || 'https://placehold.co/500x500.png',
    url: highQualityUrl,
    data_ai_hint: 'music song',
  };
}

export async function searchSongs(query: string, limit: number = 20): Promise<Song[]> {
  try {
    const response = await fetch(`${SAAVN_API_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
        console.error(`Failed to search JioSaavn, status: ${response.status}`);
        return [];
    }
    const json = await response.json();
    const results = json.data?.results || [];
    return results.map(mapSaavnSongToSong).filter((song): song is Song => song !== null);
  } catch (error) {
    console.error('Error searching songs on JioSaavn:', error);
    return [];
  }
}

export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  if (ids.length === 0) return [];
  try {
    const response = await fetch(`${SAAVN_API_URL}/songs?ids=${ids.join(',')}`);
     if (!response.ok) {
        console.error(`Failed to fetch songs by IDs from JioSaavn, status: ${response.status}`);
        return [];
    }
    const json = await response.json();
    const results = json.data || [];
     return results.map(mapSaavnSongToSong).filter((song): song is Song => song !== null);
  } catch (error) {
    console.error('Error fetching songs by IDs from JioSaavn:', error);
    return [];
  }
}
