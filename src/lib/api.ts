
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
        id: string;
        name: string;
        url: string;
        image: boolean;
        type: string;
        role: string;
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


const SAAVN_API_URL = 'https://saavn.dev/api';

function mapSaavnSongToSong(saavnSong: JioSong): Song | null {
  if (!saavnSong.downloadUrl || !Array.isArray(saavnSong.downloadUrl) || saavnSong.downloadUrl.length === 0) {
    return null;
  }
  const highQualityUrl = saavnSong.downloadUrl.find(q => q.quality === '320kbps')?.url;
  if (!highQualityUrl) return null;

  let artistString = 'Unknown Artist';
  if (typeof saavnSong.primaryArtists === 'string' && saavnSong.primaryArtists) {
      artistString = saavnSong.primaryArtists;
  } else if (Array.isArray(saavnSong.primaryArtists) && saavnSong.primaryArtists.length > 0) {
      artistString = saavnSong.primaryArtists.map(a => a.name).join(', ');
  }

  const formatDuration = (s: string) => {
    if (!s || isNaN(parseInt(s, 10))) return '0:00';
    const seconds = parseInt(s, 10);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const cleanName = (name: string) => name.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'");

  return {
    id: saavnSong.id,
    title: cleanName(saavnSong.name),
    artist: cleanName(artistString),
    album: saavnSong.album ? cleanName(saavnSong.album.name) : 'Unknown Album',
    duration: formatDuration(saavnSong.duration),
    coverArt: saavnSong.image?.find(q => q.quality === '500x500')?.url.replace('http:', 'https:') || 'https://placehold.co/500x500.png',
    url: highQualityUrl.replace('http:', 'https:'),
    data_ai_hint: 'music song',
  };
}

const filterSongs = (songs: (Song | null)[]): Song[] => {
    const validSongs = songs.filter((song): song is Song => song !== null);
    return validSongs.filter(song => !song.title.toLowerCase().includes('shree hanuman chalisa'));
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
    const mappedSongs = results.map(mapSaavnSongToSong);
    return filterSongs(mappedSongs);
  } catch (error) {
    console.error('Error searching songs on JioSaavn:', error);
    return [];
  }
}

export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  const validIds = ids.filter(id => id && typeof id === 'string');
  if (validIds.length === 0) return [];
  
  try {
    const response = await fetch(`${SAAVN_API_URL}/songs?id=${validIds.join(',')}`);
     if (!response.ok) {
        console.error(`Failed to fetch songs by IDs from JioSaavn, status: ${response.status}`);
        return [];
    }
    const json = await response.json();
    const results = json.data || [];
    const mappedSongs = results.map(mapSaavnSongToSong);
    return filterSongs(mappedSongs);
  } catch (error) {
    console.error('Error fetching songs by IDs from JioSaavn:', error);
    return [];
  }
}
