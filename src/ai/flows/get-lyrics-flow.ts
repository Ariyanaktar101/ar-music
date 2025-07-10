'use server';
/**
 * @fileOverview A flow to retrieve song lyrics.
 *
 * - getLyrics - A function that retrieves lyrics for a given song.
 * - GetLyricsInput - The input type for the getLyrics function.
 * - GetLyricsOutput - The return type for the getLyrics function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetLyricsInputSchema = z.object({
  songTitle: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
});
export type GetLyricsInput = z.infer<typeof GetLyricsInputSchema>;

const GetLyricsOutputSchema = z.object({
  lyrics: z
    .string()
    .describe('The lyrics of the song. Each line should be separated by a newline character. If no lyrics are found, return an empty string.'),
});
export type GetLyricsOutput = z.infer<typeof GetLyricsOutputSchema>;

export async function getLyrics(
  input: GetLyricsInput
): Promise<GetLyricsOutput> {
  return getLyricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLyricsPrompt',
  input: { schema: GetLyricsInputSchema },
  output: { schema: GetLyricsOutputSchema },
  prompt: `Find the lyrics for the song "{{songTitle}}" by "{{artist}}". Return only the lyrics. If you cannot find the lyrics, return an empty string.`,
});

const getLyricsFlow = ai.defineFlow(
  {
    name: 'getLyricsFlow',
    inputSchema: GetLyricsInputSchema,
    outputSchema: GetLyricsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
