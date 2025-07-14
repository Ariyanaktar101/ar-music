

import type { Song } from '@/lib/types';

// Helper function to replace 'HTML entities' with their actual characters
function decodeHtml(html: string | undefined): string {
    if (!html) return '';
    const replacements: { [key: string]: string } = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
    };
    return html.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, match => replacements[match]);
}

function getArtistNames(saavnSong: any): string {
    if (saavnSong.artists?.primary && Array.isArray(saavnSong.artists.primary) && saavnSong.artists.primary.length > 0) {
        return decodeHtml(saavnSong.artists.primary.map((artist: any) => artist.name).join(', '));
    }
    if (typeof saavnSong.primaryArtists === 'string') {
        return decodeHtml(saavnSong.primaryArtists);
    }
    if (Array.isArray(saavnSong.artists) && saavnSong.artists.length > 0) {
        return decodeHtml(saavnSong.artists.map((artist: any) => artist.name).join(', '));
    }
    return 'Unknown Artist';
}


export function mapSaavnSongToSong(saavnSong: any): Song | null {
  try {
    const title = decodeHtml(saavnSong.name || saavnSong.title);
    
    // Explicitly filter out known problematic tracks
    if (title.toLowerCase().includes('hanuman chalisa')) {
      return null;
    }

    const id = saavnSong.id;
    if (!id) return null;

    // Prioritize 320kbps URL, then fall back. If no valid URL, discard the song.
    const downloadUrl = saavnSong.downloadUrl?.find((url: any) => url.quality === '320kbps')?.url ||
                        saavnSong.downloadUrl?.find((url: any) => url.quality === '128kbps')?.url;
    
    if (!downloadUrl) {
      console.warn(`No playable URL found for song: ${title}. Skipping.`);
      return null;
    }

    const artist = getArtistNames(saavnSong);
    const album = decodeHtml(saavnSong.album?.name || 'Unknown Album');
    
    const durationSeconds = parseInt(saavnSong.duration || '0', 10);
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const image = saavnSong.image?.find((img: any) => img.quality === '500x500')?.url ||
                  saavnSong.image?.find((img: any) => img.quality === '150x150')?.url ||
                  'https://placehold.co/500x500.png';


    return {
      id,
      title,
      artist,
      album,
      duration,
      coverArt: image,
      url: downloadUrl,
    };
  } catch (error) {
    console.error("Error mapping Saavn song:", error, saavnSong);
    return null;
  }
}

export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const response = await fetch(`https://saavn.dev/api/songs?id=${ids.join(',')}`);
    const data = await response.json();
    
    if (data.success && data.data.length > 0) {
      const mappedSongs = data.data
        .map(mapSaavnSongToSong)
        .filter((s: Song | null): s is Song => s !== null);
      return mappedSongs;
    }
  } catch (error) {
    console.error('Error fetching songs by IDs from Saavn API:', error);
  }
  return [];
}
