
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

export function mapYouTubeVideoToSong(video: any): Song | null {
  try {
    if (!video.id || !video.id.videoId) return null;
    
    const id = video.id.videoId;
    const title = decodeHtml(video.snippet.title);
    const artist = decodeHtml(video.snippet.channelTitle);
    
    // The YouTube Search API v3 does not provide duration or a direct audio stream URL.
    // We will construct a video URL and rely on the player to handle it.
    // Duration will be shown as 0:00 until the media loads.
    const url = `https://www.youtube.com/watch?v=${id}`;
    
    const coverArt = video.snippet.thumbnails?.high?.url || 
                     video.snippet.thumbnails?.medium?.url || 
                     video.snippet.thumbnails?.default?.url || 
                     'https://placehold.co/500x500.png';

    return {
      id,
      title,
      artist,
      album: artist, // YouTube doesn't have albums, so we'll use artist/channel name
      duration: '0:00', // Placeholder, will be updated on media load
      coverArt,
      url, // This is a video URL, not a direct audio stream
    };
  } catch (error) {
    console.error("Error mapping YouTube video:", error, video);
    return null;
  }
}

// NOTE: The YouTube API's search endpoint doesn't return full details for multiple videos at once
// like the Saavn API did. A getSongsByIds equivalent would require multiple calls to the videos endpoint.
// For simplicity, we will rely on the details from the search endpoint.
// If more details were needed, a function like this would be implemented:
/*
export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  // ... implementation to call youtube.videos.list for each ID
}
*/
