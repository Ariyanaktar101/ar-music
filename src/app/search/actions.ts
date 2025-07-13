
'use server';

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
    if (typeof saavnSong.primaryArtists === 'string') {
        return decodeHtml(saavnSong.primaryArtists);
    }
     if (Array.isArray(saavnSong.artists?.primary) && saavnSong.artists.primary.length > 0) {
        return decodeHtml(saavnSong.artists.primary.map((artist: any) => artist.name).join(', '));
    }
     if (Array.isArray(saavnSong.artists) && saavnSong.artists.length > 0) {
        return decodeHtml(saavnSong.artists.map((artist: any) => artist.name).join(', '));
    }
    return 'Unknown Artist';
}


function mapSaavnSongToSong(saavnSong: any): Song | null {
  try {
    const id = saavnSong.id;
    if (!id) return null;

    const title = decodeHtml(saavnSong.name || saavnSong.title);
    const artist = getArtistNames(saavnSong);
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

export async function handleSearch(query: string, limit: number = 20): Promise<Song[]> {
  if (!query) return [];
  try {
    const response = await fetch(`https://jiosaavn-api.vercel.app/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await response.json();
    
    if (data.success && data.data.results.length > 0) {
      const mappedSongs = data.data.results
        .map(mapSaavnSongToSong)
        .filter((s: Song | null): s is Song => s !== null);
      return mappedSongs;
    }

  } catch (error) {
    console.error('Error searching JioSaavn API:', error);
  }
  return [];
}

export async function getRecommendedSongs(userId: string): Promise<Song[]> {
    if (!userId) return [];
    try {
        // The public API uses the /modules endpoint to get personalized recommendations
        const response = await fetch(`https://jiosaavn-api.vercel.app/modules?language=hindi,english`);
        const data = await response.json();

        if (data.success && data.data?.recommendations?.songs?.length > 0) {
            const mappedSongs = data.data.recommendations.songs
                .map(mapSaavnSongToSong)
                .filter((s: Song | null): s is Song => s !== null);
            return mappedSongs.slice(0, 12); // Limit to 12 songs for a 2x6 grid
        }
    } catch (error) {
        console.error('Error fetching recommended songs from JioSaavn API:', error);
    }
    // Fallback to top hindi songs if recommendations fail
    return handleSearch("top hindi songs", 12);
}
