
'use server';

import { searchSongs } from '@/lib/api';
import type { Song } from '@/lib/types';

export async function handleSearch(query: string): Promise<Song[]> {
  if (!query) return [];
  const results = await searchSongs(query, 100);
  return results;
}
