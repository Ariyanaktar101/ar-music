// This file is now mostly deprecated in favor of the JioSaavn API.
// It's kept for potential future use. All mock data has been removed.

export type Song = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverArt: string;
  data_ai_hint: string;
  url: string;
  album: string;
};

export type Album = {
  id: number;
  title: string;
  artist: string;
  coverArt: string;
  data_ai_hint: string;
  songs: Song[];
};
