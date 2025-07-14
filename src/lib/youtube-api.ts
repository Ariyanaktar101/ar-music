import type { Song } from '@/lib/types';

function formatDuration(isoString: string): string {
    const match = isoString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";

    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    const fmtMinutes = Math.floor(totalSeconds / 60);
    const fmtSeconds = totalSeconds % 60;

    return `${fmtMinutes}:${fmtSeconds.toString().padStart(2, '0')}`;
}

// Note: This function is not currently used as search results don't include duration.
// It would be useful if fetching video details by ID.
// async function getVideoDuration(videoId: string, apiKey: string): Promise<string> {
//     try {
//         const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`);
//         const data = await response.json();
//         if (data.items && data.items.length > 0) {
//             const isoDuration = data.items[0].contentDetails.duration;
//             return formatDuration(isoDuration);
//         }
//     } catch (error) {
//         console.error("Error fetching video duration", error);
//     }
//     return "0:00";
// }

export function mapYouTubeVideoToSong(video: any): Song | null {
  try {
    if (!video || !video.id || !video.id.videoId) return null;
    
    const videoId = video.id.videoId;

    return {
      id: videoId,
      title: video.snippet.title,
      artist: video.snippet.channelTitle,
      album: video.snippet.channelTitle, // YouTube doesn't have a direct "album" concept for videos
      duration: "3:00", // Placeholder, as search result doesn't provide duration
      coverArt: video.snippet.thumbnails.high?.url || 'https://placehold.co/500x500.png',
      // This is a critical part: constructing a streamable URL.
      // This URL might not work in all environments and is a best-effort approach.
      // A more robust solution might involve a server-side component.
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  } catch (error) {
    console.error("Error mapping YouTube video:", error, video);
    return null;
  }
}
