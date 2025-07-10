export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverArt: string;
  url: string; // The playable URL
  data_ai_hint?: string;
};

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  songIds: string[];
  coverArt?: string; // Optional: use the cover art of the first song
};
