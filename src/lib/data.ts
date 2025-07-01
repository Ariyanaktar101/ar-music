export type Song = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  coverArt: string;
  data_ai_hint: string;
};

export type Album = {
  id: number;
  title: string;
  artist: string;
  coverArt: string;
  data_ai_hint: string;
  songs: Song[];
};

export const featuredPlaylists: Album[] = [
  {
    id: 1,
    title: 'Chill Vibes',
    artist: 'Various Artists',
    coverArt: 'https://source.unsplash.com/300x300?abstract,calm',
    data_ai_hint: 'abstract calm',
    songs: [],
  },
  {
    id: 2,
    title: 'Focus Flow',
    artist: 'Various Artists',
    coverArt: 'https://source.unsplash.com/300x300?modern,technology',
    data_ai_hint: 'modern technology',
    songs: [],
  },
  {
    id: 3,
    title: 'Workout Beats',
    artist: 'Various Artists',
    coverArt: 'https://source.unsplash.com/300x300?gym,fitness',
    data_ai_hint: 'gym fitness',
    songs: [],
  },
  {
    id: 4,
    title: 'Indie Hits',
    artist: 'Various Artists',
    coverArt: 'https://source.unsplash.com/300x300?guitar,concert',
    data_ai_hint: 'guitar concert',
    songs: [],
  },
  {
    id: 5,
    title: 'Acoustic Mornings',
    artist: 'Various Artists',
    coverArt: 'https://source.unsplash.com/300x300?coffee,sunrise',
    data_ai_hint: 'coffee sunrise',
    songs: [],
  },
  {
    id: 6,
    title: 'Pop Party',
    artist: 'Various Artists',
    coverArt: 'https://source.unsplash.com/300x300?colorful,dance',
    data_ai_hint: 'colorful dance',
    songs: [],
  },
];

export const newReleases: Album[] = [
  {
    id: 7,
    title: 'Echoes of a Dream',
    artist: 'Luna Bloom',
    coverArt: 'https://source.unsplash.com/300x300?galaxy,stars',
    data_ai_hint: 'galaxy stars',
    songs: [],
  },
  {
    id: 8,
    title: 'City Lights',
    artist: 'The Vindicators',
    coverArt: 'https://source.unsplash.com/300x300?neon,city',
    data_ai_hint: 'neon city',
    songs: [],
  },
  {
    id: 9,
    title: 'Ocean Deep',
    artist: 'Coral',
    coverArt: 'https://source.unsplash.com/300x300?underwater,ocean',
    data_ai_hint: 'underwater ocean',
    songs: [],
  },
  {
    id: 10,
    title: 'Midnight Drive',
    artist: 'Ryder',
    coverArt: 'https://source.unsplash.com/300x300?car,night',
    data_ai_hint: 'car night',
    songs: [],
  },
    {
    id: 11,
    title: 'Solar Flare',
    artist: 'Orion',
    coverArt: 'https://source.unsplash.com/300x300?sun,space',
    data_ai_hint: 'sun space',
    songs: [],
  },
  {
    id: 12,
    title: 'Forest Whispers',
    artist: 'Sylva',
    coverArt: 'https://source.unsplash.com/300x300?enchanted,forest',
    data_ai_hint: 'enchanted forest',
    songs: [],
  },
];

export const trendingSongs: Album[] = [
  { id: 13, title: "Blinding Lights", artist: "The Weeknd", coverArt: "https://source.unsplash.com/300x300?neon,city", data_ai_hint: "neon city", songs: [] },
  { id: 14, title: "Kesariya", artist: "Arijit Singh", coverArt: "https://source.unsplash.com/300x300?love,romance", data_ai_hint: "love romance", songs: [] },
  { id: 15, title: "As It Was", artist: "Harry Styles", coverArt: "https://source.unsplash.com/300x300?vintage,aesthetic", data_ai_hint: "vintage aesthetic", songs: [] },
  { id: 16, title: "Chaleya", artist: "Arijit Singh, Shilpa Rao", coverArt: "https://source.unsplash.com/300x300?dance,couple", data_ai_hint: "dance couple", songs: [] },
  { id: 17, title: "Levitating", artist: "Dua Lipa", coverArt: "https://source.unsplash.com/300x300?disco,space", data_ai_hint: "disco space", songs: [] },
  { id: 18, title: "Raatan Lambiyan", artist: "Tanishk Bagchi, Jubin Nautiyal", coverArt: "https://source.unsplash.com/300x300?night,stars", data_ai_hint: "night stars", songs: [] },
  { id: 19, title: "Peaches", artist: "Justin Bieber", coverArt: "https://source.unsplash.com/300x300?summer,vibe", data_ai_hint: "summer vibe", songs: [] },
  { id: 20, title: "Jhoome Jo Pathaan", artist: "Vishal-Shekhar, Arijit Singh", coverArt: "https://source.unsplash.com/300x300?action,movie", data_ai_hint: "action movie", songs: [] },
  { id: 21, title: "Save Your Tears", artist: "The Weeknd", coverArt: "https://source.unsplash.com/300x300?rainy,night", data_ai_hint: "rainy night", songs: [] },
  { id: 22, title: "Ghungroo", artist: "Vishal-Shekhar, Arijit Singh", coverArt: "https://source.unsplash.com/300x300?beach,party", data_ai_hint: "beach party", songs: [] },
  { id: 23, title: "Watermelon Sugar", artist: "Harry Styles", coverArt: "https://source.unsplash.com/300x300?summer,fruit", data_ai_hint: "summer fruit", songs: [] },
  { id: 24, title: "Apna Bana Le", artist: "Sachin-Jigar, Arijit Singh", coverArt: "https://source.unsplash.com/300x300?couple,silhouette", data_ai_hint: "couple silhouette", songs: [] },
  { id: 25, title: "Good 4 U", artist: "Olivia Rodrigo", coverArt: "https://source.unsplash.com/300x300?teenager,angst", data_ai_hint: "teenager angst", songs: [] },
  { id: 26, title: "Lut Gaye", artist: "Tanishk Bagchi, Jubin Nautiyal", coverArt: "https://source.unsplash.com/300x300?historical,romance", data_ai_hint: "historical romance", songs: [] },
  { id: 27, title: "Stay", artist: "The Kid LAROI, Justin Bieber", coverArt: "https://source.unsplash.com/300x300?city,rooftop", data_ai_hint: "city rooftop", songs: [] },
  { id: 28, title: "Tum Hi Ho", artist: "Arijit Singh", coverArt: "https://source.unsplash.com/300x300?rain,love", data_ai_hint: "rain love", songs: [] },
  { id: 29, title: "Drivers License", artist: "Olivia Rodrigo", coverArt: "https://source.unsplash.com/300x300?car,drive", data_ai_hint: "car drive", songs: [] },
  { id: 30, title: "Maan Meri Jaan", artist: "King", coverArt: "https://source.unsplash.com/300x300?couple,goals", data_ai_hint: "couple goals", songs: [] },
  { id: 31, title: "Bad Guy", artist: "Billie Eilish", coverArt: "https://source.unsplash.com/300x300?dark,aesthetic", data_ai_hint: "dark aesthetic", songs: [] },
  { id: 32, title: "Shayad", artist: "Pritam, Arijit Singh", coverArt: "https://source.unsplash.com/300x300?young,love", data_ai_hint: "young love", songs: [] },
];

export const hindiSongs: Album[] = [
    { id: 33, title: "Kalank", artist: "Pritam, Arijit Singh", coverArt: "https://source.unsplash.com/300x300?royal,palace", data_ai_hint: "royal palace", songs: [] },
    { id: 34, title: "Ghar More Pardesiya", artist: "Pritam, Shreya Ghoshal", coverArt: "https://source.unsplash.com/300x300?indian,dance", data_ai_hint: "indian dance", songs: [] },
    { id: 35, title: "Makhna", artist: "Tanishk Bagchi, Yasser Desai", coverArt: "https://source.unsplash.com/300x300?road,trip", data_ai_hint: "road trip", songs: [] },
    { id: 36, title: "Ve Maahi", artist: "Tanishk Bagchi, Arijit Singh", coverArt: "https://source.unsplash.com/300x300?wedding,couple", data_ai_hint: "wedding couple", songs: [] },
    { id: 37, title: "First Class", artist: "Pritam, Arijit Singh", coverArt: "https://source.unsplash.com/300x300?celebration,dance", data_ai_hint: "celebration dance", songs: [] },
    { id: 38, title: "Pal Pal Dil Ke Paas", artist: "Sachet-Parampara", coverArt: "https://source.unsplash.com/300x300?mountain,romance", data_ai_hint: "mountain romance", songs: [] },
];

export const englishSongs: Album[] = [
    { id: 39, title: "Shape of You", artist: "Ed Sheeran", coverArt: "https://source.unsplash.com/300x300?abstract,shapes", data_ai_hint: "abstract shapes", songs: [] },
    { id: 40, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", coverArt: "https://source.unsplash.com/300x300?funky,dance", data_ai_hint: "funky dance", songs: [] },
    { id: 41, title: "Someone You Loved", artist: "Lewis Capaldi", coverArt: "https://source.unsplash.com/300x300?sad,portrait", data_ai_hint: "sad portrait", songs: [] },
    { id: 42, title: "Dance Monkey", artist: "Tones and I", coverArt: "https://source.unsplash.com/300x300?monkey,dancing", data_ai_hint: "monkey dancing", songs: [] },
    { id: 43, title: "Closer", artist: "The Chainsmokers ft. Halsey", coverArt: "https://source.unsplash.com/300x300?couple,close", data_ai_hint: "couple close", songs: [] },
    { id: 44, title: "Perfect", artist: "Ed Sheeran", coverArt: "https://source.unsplash.com/300x300?romantic,dance", data_ai_hint: "romantic dance", songs: [] },
];

export const mockSong: Song = {
  id: 1,
  title: 'Starlight',
  artist: 'Luna Bloom',
  duration: '3:45',
  coverArt: 'https://source.unsplash.com/80x80?galaxy,stars',
  data_ai_hint: 'galaxy stars',
};
