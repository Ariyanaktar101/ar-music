
import type { Song } from './types';

// NOTE: This API is an internal, private API used by YouTube Music's own web app.
// It is undocumented and can change or break at any moment.
// It also does NOT provide a directly playable audio URL, so playback will not work.
const YTM_API_URL = `https://music.youtube.com/youtubei/v1/search?key=${process.env.YOUTUBE_API_KEY}`;


export async function searchSongs(query: string, limit: number = 20): Promise<Song[]> {
  if (!process.env.YOUTUBE_API_KEY) {
    console.error("YouTube API Key is not configured in .env file.");
    return [];
  }

  try {
    const response = await fetch(YTM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: 'WEB_REMIX',
            clientVersion: '1.20240424.01.00',
          },
        },
        query: query,
        params: 'Eg-KAQwIABAAGAAgACgAMABqChAEEAMSAhAKBAgAEAo=', // A common param for songs
      }),
    });

    if (!response.ok) {
        console.error("YouTube Music API request failed with status:", response.status);
        return [];
    }
    
    const json = await response.json();
    const sections = json?.contents?.tabbedSearchResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents;
    const songResults = sections?.find((section: any) => section?.musicShelfRenderer?.title?.runs[0]?.text === 'Songs')?.musicShelfRenderer?.contents || [];

    const mappedSongs: Song[] = songResults.map((item: any): Song | null => {
        const musicItem = item.musicResponsiveListItemRenderer;
        if (!musicItem) return null;
        
        const videoId = musicItem.playlistItemData?.videoId;
        if (!videoId) return null;
        
        const title = musicItem.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text;
        const artists = musicItem.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.filter((run: any) => run.navigationEndpoint).map((run: any) => run.text).join(', ');
        const album = musicItem.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.find((run: any) => run.navigationEndpoint?.browseEndpoint?.browseId.startsWith('MPRE'))?.text;
        const durationText = musicItem.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.slice(-1)[0]?.text;
        const coverArt = musicItem.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.pop()?.url;

        return {
          id: videoId,
          title: title || 'Unknown Title',
          artist: artists || 'Unknown Artist',
          album: album || 'Unknown Album',
          duration: durationText || '0:00',
          coverArt: coverArt || 'https://placehold.co/500x500.png',
          // NOTE: This URL is not directly playable by the audio element.
          // This is a limitation of using the YouTube API this way.
          url: `https://www.youtube.com/watch?v=${videoId}`, 
        }
    }).filter((s: Song | null): s is Song => s !== null);

    return mappedSongs.slice(0, limit);

  } catch (error) {
    console.error('Error searching YouTube Music API:', error);
  }
  
  return [];
}

export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  // The unofficial YouTube Music API doesn't have a batch "get by ID" endpoint.
  // We would need to either store the full song object when it's liked/added to a playlist,
  // or implement a more complex fetching strategy. For now, this will return empty
  // to prevent errors on pages that use it (Liked, Playlists).
  console.warn("getSongsByIds is not implemented for the YouTube Music API and will return an empty array.");
  return [];
}
