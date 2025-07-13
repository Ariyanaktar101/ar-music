
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


function mapSaavnSongToSong(saavnSong: any): Song | null {
  try {
    const id = saavnSong.id;
    if (!id) return null;

    const title = decodeHtml(saavnSong.name || saavnSong.title);
    const artist = decodeHtml(saavnSong.primaryArtists || 'Unknown Artist');
    const album = decodeHtml(saavnSong.album?.name || 'Unknown Album');
    
    const durationSeconds = parseInt(saavnSong.duration || '0', 10);
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const image = saavnSong.image?.find((img: any) => img.quality === '500x500')?.link ||
                  saavnSong.image?.find((img: any) => img.quality === '150x150')?.link ||
                  'https://placehold.co/500x500.png';

    // The downloadUrl is an array of objects with different qualities
    const downloadUrl = saavnSong.downloadUrl?.find((url: any) => url.quality === '320kbps')?.link ||
                        saavnSong.downloadUrl?.find((url: any) => url.quality === '128kbps')?.link;
    
    if (!downloadUrl) {
      console.warn(`No playable URL found for song: ${title}`);
      return null;
    }

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
    const response = await fetch(`https://saavn.dev/api/songs?ids=${ids.join(',')}`);
    const data = await response.json();
    
    if (data.success && data.data.length > 0) {
      const mappedSongs = data.data
        .map(mapSaavnSongToSong)
        .filter((s: Song | null): s is Song => s !== null);
      return mappedSongs;
    }
  } catch (error) {
    console.error('Error fetching songs by IDs from JioSaavn API:', error);
  }
  return [];
}
