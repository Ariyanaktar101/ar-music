
import type { Song } from './types';

const YOUTUBE_MUSIC_API_URL = 'https://music.youtube.com/youtubei/v1/search';

// This is a simplified, unofficial payload structure. It may need adjustment.
function getSearchPayload(query: string) {
  return {
    context: {
      client: {
        clientName: 'WEB_REMIX',
        clientVersion: '1.20240325.01.00',
      },
    },
    query: query,
    params: 'Eg-KAQwIARAAGAAgACgAMABqChAEEAMSAhAKBgcIAxAGEAgYCg==', // Params for songs
  };
}

function mapYouTubeSongToSong(ytSong: any): Song | null {
  try {
    const musicResponsiveListItem = ytSong.musicResponsiveListItemRenderer;
    if (!musicResponsiveListItem) return null;

    const videoId = musicResponsiveListItem.playlistItemData?.videoId;
    if (!videoId) return null;

    const title = musicResponsiveListItem.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text;
    const artistsRuns = musicResponsiveListItem.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.filter((run: any) => run.navigationEndpoint);
    const artist = artistsRuns?.map((a: any) => a.text).join(', ') || 'Unknown Artist';
    const albumRun = musicResponsiveListItem.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.find((run: any) => run.navigationEndpoint?.browseEndpoint?.browseId.startsWith('MPRE'));
    const album = albumRun?.text || 'Unknown Album';
    const durationText = musicResponsiveListItem.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.slice(-1)[0].text.trim();
    
    // Attempt to find the best thumbnail
    const thumbnails = musicResponsiveListItem.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
    const coverArt = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : 'https://placehold.co/500x500.png';

    return {
      id: videoId,
      title: title || 'Unknown Title',
      artist,
      album,
      duration: durationText || '0:00',
      coverArt: coverArt,
      // IMPORTANT: This URL is not a direct audio stream. It's a link to the video.
      // The player will not be able to play this.
      url: `https://music.youtube.com/watch?v=${videoId}`,
    };
  } catch (error) {
    console.error("Error mapping YouTube song:", error, ytSong);
    return null;
  }
}

export async function searchSongs(query: string, limit: number = 20): Promise<Song[]> {
  if (!query) return [];
  try {
    const response = await fetch(`${YOUTUBE_MUSIC_API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(getSearchPayload(query)),
    });

    if (!response.ok) {
        console.error("YouTube Music API request failed with status:", response.status);
        return [];
    }
    const json = await response.json();

    const songResults = json.contents?.tabbedSearchResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.find(
        (c: any) => c.musicShelfRenderer && c.musicShelfRenderer.title.runs[0].text === 'Songs'
    )?.musicShelfRenderer?.contents;

    if (songResults && songResults.length > 0) {
      return songResults.map(mapYouTubeSongToSong).filter((s: Song | null): s is Song => s !== null).slice(0, limit);
    }
  } catch (error) {
    console.error('Error searching YouTube Music API:', error);
  }
  return [];
}


// The unofficial YouTube Music Search API does not support fetching songs by ID.
// This function will return an empty array to prevent pages that use it (Liked, Playlist) from crashing.
export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  console.warn("getSongsByIds is not supported by the current API and will return an empty array.");
  return [];
}
