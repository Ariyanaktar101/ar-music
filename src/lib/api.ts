
import type { Song } from './types';

// The Saavn API is now the primary source for music data.
const SAAVN_API_URL = 'https://saavn.dev/api';

// Helper function to map the Saavn API response to our app's Song type.
function mapSaavnSongToSong(saavnSong: any): Song {
  // Saavn provides multiple image links, we pick the highest quality (500x500)
  const coverArtUrl = saavnSong.image.find((img: any) => img.quality === '500x500')?.url || saavnSong.image[0]?.url || 'https://placehold.co/500x500.png';
  // Saavn also provides multiple download links, we pick the highest quality.
  const playableUrl = saavnSong.downloadUrl.find((d: any) => d.quality === '320kbps')?.url || saavnSong.downloadUrl[0]?.url;

  return {
    id: saavnSong.id,
    title: saavnSong.name.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
    artist: saavnSong.artists.primary.map((a: any) => a.name).join(', '),
    album: saavnSong.album.name.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
    duration: new Date(saavnSong.duration * 1000).toISOString().substr(14, 5),
    coverArt: coverArtUrl,
    url: playableUrl,
  };
}

export async function searchSongs(query: string, limit: number = 20): Promise<Song[]> {
  if (!query) return [];
  try {
    const response = await fetch(`${SAAVN_API_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
        console.error("Saavn API request failed with status:", response.status);
        return [];
    }
    const json = await response.json();
    if (json.success && json.data.results) {
      return json.data.results.map(mapSaavnSongToSong);
    }
  } catch (error) {
    console.error('Error searching Saavn API:', error);
  }
  return [];
}

export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const response = await fetch(`${SAAVN_API_URL}/songs?ids=${ids.join(',')}`);
    if (!response.ok) {
        console.error("Saavn API request failed with status:", response.status);
        return [];
    }
    const json = await response.json();
    if (json.success && json.data) {
      return json.data.map(mapSaavnSongToSong);
    }
  } catch (error) {
    console.error('Error fetching songs by ID from Saavn API:', error);
  }
  return [];
}
