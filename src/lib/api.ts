
import type { Song } from './types';

// This is the raw type from the JioSaavn API
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
        name: string;
      }[];
  image: {
    quality: string;
    url: string;
  }[];
  downloadUrl: {
    quality: string;
    url: string;
  }[];
};

function mapJioSongToSong(song: JioSong): Song {
  let artists = 'Unknown Artist';
  if (typeof song.primaryArtists === 'string' && song.primaryArtists) {
    artists = song.primaryArtists;
  } else if (Array.isArray(song.primaryArtists) && song.primaryArtists.length > 0) {
    artists = song.primaryArtists.map((a) => a.name).join(', ');
  }

  const image = song.image.find((i) => i.quality === '500x500') || song.image.slice(-1)[0];
  const audio = song.downloadUrl.find((d) => d.quality === '320kbps') || song.downloadUrl.slice(-1)[0];

  const formatDuration = (durationInSeconds: string) => {
    const seconds = parseInt(durationInSeconds, 10);
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    id: song.id,
    title: song.name.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
    artist: artists.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
    album: song.album.name.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
    duration: formatDuration(song.duration),
    coverArt: image.url.replace('http:', 'https:'),
    url: audio.url.replace('http:', 'https:'),
    data_ai_hint: 'music song',
  };
}

export async function searchSongs(query: string, limit: number = 20): Promise<Song[]> {
  try {
    const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&page=1&limit=${limit}`, { next: { revalidate: 3600 } });
    if (!response.ok) {
      console.error(`Failed to fetch songs from JioSaavn API, status: ${response.status}`);
      return [];
    }
    const json = await response.json();
    const results = json.data?.results || [];
    return results
      .filter((song: JioSong) => song.name.toLowerCase() !== 'shree hanuman chalisa')
      .map(mapJioSongToSong);
  } catch (error) {
    console.error('Error searching songs:', error);
    return [];
  }
}

export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  if (ids.length === 0) return [];
  try {
    const response = await fetch(`https://saavn.dev/api/songs?ids=${ids.join(',')}`, { next: { revalidate: 3600 } });
    if (!response.ok) {
      console.error(`Failed to fetch songs by IDs, status: ${response.status}`);
      return [];
    }
    const json = await response.json();
    const results = json.data || [];
    return results.map(mapJioSongToSong);
  } catch (error) {
    console.error('Error fetching songs by IDs:', error);
    return [];
  }
}
