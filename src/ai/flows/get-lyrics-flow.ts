
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
  album: z.string().describe('The album the song belongs to.'),
});
export type GetLyricsInput = z.infer<typeof GetLyricsInputSchema>;

const GetLyricsOutputSchema = z.object({
  lyrics: z
    .string()
    .describe('The lyrics of the song. Each line should be separated by a newline character. If no lyrics are found, return the string "[No lyrics available]".'),
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
  prompt: `You are a music expert and a persistent researcher. Your task is to provide the lyrics for a given song.

Song Title: "{{songTitle}}"
Artist: "{{artist}}"
Album: "{{album}}"

Instructions:
1.  Search diligently for the lyrics for the specified song. Use all three pieces of information (title, artist, and album) to find the correct song. Try variations of the title and artist if needed.
2.  Your response MUST contain only the lyrics.
3.  Each line of the lyrics must be separated by a newline character.
4.  Do NOT include any introductory phrases, titles, artist names, or any other text. For example, do not start with "Here are the lyrics...".
5.  If, after an exhaustive search, you absolutely cannot find the lyrics, you MUST return the exact string "[No lyrics available]" in the 'lyrics' field.`,
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
