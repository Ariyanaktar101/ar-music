
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
const YTM_API_URL = `https://music.youtube.com/youtubei/v1/search?key=${process.env.YOUTUBE_API_KEY}`;


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
  // First, try searching with the YouTube Music API (experimental)
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

    if (response.ok) {
      const json = await response.json();
      const sections = json?.contents?.tabbedSearchResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents;
      const songResults = sections?.find((section: any) => section?.musicShelfRenderer?.title?.runs[0]?.text === 'Songs')?.musicShelfRenderer?.contents || [];

      const mappedSongs: Song[] = songResults.map((item: any): Song | null => {
          const musicItem = item.musicResponsiveListItemRenderer;
          if (!musicItem) return null;
          
          const videoId = musicItem.playlistItemData?.videoId;
          if (!videoId) return null;

          const url = `https://www.youtube.com/watch?v=${videoId}`;
          
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

      if (mappedSongs.length > 0) {
        // Since YT Music URLs are not directly playable, we can't use them yet.
        // This is a placeholder for a future implementation that can handle them.
        // For now, we will log them and fall back to Saavn.
        console.log("Found songs on YouTube Music, but they are not playable yet.", mappedSongs);
        // return mappedSongs.slice(0, limit);
      }
    }
  } catch (error) {
    console.error('Error searching YouTube Music API:', error);
  }
  
  // Fallback to Saavn API if YouTube Music fails or returns no playable results
  try {
    const saavnResponse = await fetch(`${SAAVN_API_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (saavnResponse.ok) {
        const json = await saavnResponse.json();
        const results = json.data?.results || [];
        if (results.length > 0) {
            const mappedSongs = results.map(mapSaavnSongToSong);
            const filtered = filterSongs(mappedSongs);
            if (filtered.length > 0) {
              return filtered;
            }
        }
    }
  } catch (error) {
    console.error('Error searching songs on JioSaavn:', error);
  }

  return [];
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
