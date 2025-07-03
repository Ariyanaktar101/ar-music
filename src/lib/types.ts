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
