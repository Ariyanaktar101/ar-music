import type { Song } from '@/lib/types';

// A simple in-memory cache for the access token
let accessToken: { value: string; expires: number } | null = null;

export async function getSpotifyAccessToken(): Promise<string | null> {
  // If we have a valid token in cache, return it
  if (accessToken && Date.now() < accessToken.expires) {
    return accessToken.value;
  }
  
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Spotify client ID or secret is missing.");
    return null;
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to get Spotify access token: ${response.statusText}, Body: ${errorBody}`);
    }

    const data = await response.json();
    
    // Cache the token with its expiration time (subtracting 60s for safety margin)
    accessToken = {
        value: data.access_token,
        expires: Date.now() + (data.expires_in - 60) * 1000
    };
    
    return accessToken.value;

  } catch (error) {
    console.error(error);
    return null;
  }
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
}

export function mapSpotifyTrackToSong(track: any): Song | null {
  try {
    if (!track || !track.id) return null;
    
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album.name,
      duration: formatDuration(track.duration_ms),
      coverArt: track.album.images?.[0]?.url || 'https://placehold.co/500x500.png',
      url: track.preview_url, // IMPORTANT: This is a 30-second preview
    };
  } catch (error) {
    console.error("Error mapping Spotify track:", error, track);
    return null;
  }
}
