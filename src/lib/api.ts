
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
        name: string;
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

// Spotify API types
type SpotifyTrack = {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    duration_ms: number;
    preview_url: string;
};

// --- Spotify API Integration ---

let spotifyAccessToken = '';

async function getSpotifyToken() {
    if (spotifyAccessToken) {
        // Here you might want to check if the token is expired.
        // For simplicity, we'll just reuse it. A robust implementation
        // would store the expiry time and refresh it.
        return spotifyAccessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
        console.error("Spotify API credentials are not set in .env file.");
        return null;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        },
        body: 'grant_type=client_credentials',
        next: { revalidate: 3500 } // Re-fetch token every ~hour
    });

    if (!response.ok) {
        console.error('Failed to get Spotify token');
        return null;
    }

    const data = await response.json();
    spotifyAccessToken = data.access_token;
    return spotifyAccessToken;
}


function mapSpotifyTrackToSong(track: SpotifyTrack): Song | null {
    if (!track.preview_url) {
        // Spotify doesn't provide a preview for every song.
        // We'll have to skip these ones.
        return null;
    }

    const formatDuration = (durationInMs: number) => {
        const seconds = Math.floor(durationInMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return {
        id: track.id,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        duration: formatDuration(track.duration_ms),
        coverArt: track.album.images?.[0]?.url || 'https://placehold.co/500x500.png',
        url: track.preview_url, // IMPORTANT: This is a 30-second preview
        data_ai_hint: 'music song',
    };
}


export async function searchSongs(query: string, limit: number = 20): Promise<Song[]> {
  const token = await getSpotifyToken();
  if (!token) return [];

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
        console.error(`Failed to search Spotify, status: ${response.status}`);
        return [];
    }

    const json = await response.json();
    const results = json.tracks?.items || [];
    
    return results.map(mapSpotifyTrackToSong).filter((song): song is Song => song !== null);

  } catch (error) {
    console.error('Error searching songs on Spotify:', error);
    return [];
  }
}

export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  if (ids.length === 0) return [];
  const token = await getSpotifyToken();
  if (!token) return [];

  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${ids.join(',')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      console.error(`Failed to fetch songs by IDs from Spotify, status: ${response.status}`);
      return [];
    }

    const json = await response.json();
    const results = json.tracks || [];

    return results.map(mapSpotifyTrackToSong).filter((song): song is Song => song !== null);

  } catch (error) {
    console.error('Error fetching songs by IDs from Spotify:', error);
    return [];
  }
}
