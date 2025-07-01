export type Song = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  coverArt: string;
};

export type Album = {
  id: number;
  title: string;
  artist: string;
  coverArt: string;
  songs: Song[];
};

export const featuredPlaylists: Album[] = [
  {
    id: 1,
    title: 'Chill Vibes',
    artist: 'Various Artists',
    coverArt: 'https://placehold.co/300x300/64B5F6/FFFFFF.png',
    data_ai_hint: 'abstract calm',
    songs: [],
  },
  {
    id: 2,
    title: 'Focus Flow',
    artist: 'Various Artists',
    coverArt: 'https://placehold.co/300x300/7DF9FF/000000.png',
    data_ai_hint: 'modern technology',
    songs: [],
  },
  {
    id: 3,
    title: 'Workout Beats',
    artist: 'Various Artists',
    coverArt: 'https://placehold.co/300x300/F0F7FF/333333.png',
    data_ai_hint: 'gym fitness',
    songs: [],
  },
  {
    id: 4,
    title: 'Indie Hits',
    artist: 'Various Artists',
    coverArt: 'https://placehold.co/300x300/64B5F6/FFFFFF.png',
    data_ai_hint: 'guitar concert',
    songs: [],
  },
  {
    id: 5,
    title: 'Acoustic Mornings',
    artist: 'Various Artists',
    coverArt: 'https://placehold.co/300x300/7DF9FF/000000.png',
    data_ai_hint: 'coffee sunrise',
    songs: [],
  },
  {
    id: 6,
    title: 'Pop Party',
    artist: 'Various Artists',
    coverArt: 'https://placehold.co/300x300/F0F7FF/333333.png',
    data_ai_hint: 'colorful dance',
    songs: [],
  },
];

export const newReleases: Album[] = [
  {
    id: 7,
    title: 'Echoes of a Dream',
    artist: 'Luna Bloom',
    coverArt: 'https://placehold.co/300x300/64B5F6/FFFFFF.png',
    data_ai_hint: 'galaxy stars',
    songs: [],
  },
  {
    id: 8,
    title: 'City Lights',
    artist: 'The Vindicators',
    coverArt: 'https://placehold.co/300x300/7DF9FF/000000.png',
    data_ai_hint: 'neon city',
    songs: [],
  },
  {
    id: 9,
    title: 'Ocean Deep',
    artist: 'Coral',
    coverArt: 'https://placehold.co/300x300/F0F7FF/333333.png',
    data_ai_hint: 'underwater ocean',
    songs: [],
  },
  {
    id: 10,
    title: 'Midnight Drive',
    artist: 'Ryder',
    coverArt: 'https://placehold.co/300x300/64B5F6/FFFFFF.png',
    data_ai_hint: 'car night',
    songs: [],
  },
    {
    id: 11,
    title: 'Solar Flare',
    artist: 'Orion',
    coverArt: 'https://placehold.co/300x300/7DF9FF/000000.png',
    data_ai_hint: 'sun space',
    songs: [],
  },
  {
    id: 12,
    title: 'Forest Whispers',
    artist: 'Sylva',
    coverArt: 'https://placehold.co/300x300/F0F7FF/333333.png',
    data_ai_hint: 'enchanted forest',
    songs: [],
  },
];

export const mockSong: Song = {
  id: 1,
  title: 'Starlight',
  artist: 'Luna Bloom',
  duration: '3:45',
  coverArt: 'https://placehold.co/80x80/64B5F6/FFFFFF.png',
  data_ai_hint: 'galaxy stars',
};
