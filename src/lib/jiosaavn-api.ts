
import type { Song } from '@/lib/types';

// Helper function to get a higher quality image URL
const getHighQualityImage = (url: string) => {
    if (!url) return 'https://placehold.co/500x500.png';
    return url.replace('150x150', '500x500').replace('50x50', '500x500');
}

// Helper function to format duration from seconds to MM:SS
const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function mapSaavnSongToSong(songData: any): Song | null {
  try {
    if (!songData || !songData.id || !songData.downloadUrl) {
      // If there's no ID or no playable URL, we can't use this song.
      return null;
    }

    // Prioritize the highest quality download URL
    const playableUrl = songData.downloadUrl.find((u: any) => u.quality === '320kbps')?.url || 
                        songData.downloadUrl.find((u: any) => u.quality === '128kbps')?.url;

    if (!playableUrl) {
      return null; // No playable URL found
    }

    // The API sometimes returns HTML entities for characters like '&'. This decodes them.
    const decodedTitle = songData.name
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
      
    const decodedAlbum = songData.album.name
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');

    return {
      id: songData.id,
      title: decodedTitle,
      artist: songData.artists.primary.map((a: any) => a.name).join(', '),
      album: decodedAlbum,
      duration: formatDuration(songData.duration),
      coverArt: getHighQualityImage(songData.image.find((i: any) => i.quality === '150x150')?.url),
      url: playableUrl,
    };
  } catch (error) {
    console.error("Error mapping Saavn song:", error, songData);
    return null;
  }
}
