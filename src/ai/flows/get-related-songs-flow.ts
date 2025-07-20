/**
 * @fileOverview A flow to get a list of songs related to a seed song.
 *
 * - getRelatedSongs - A function that returns a list of related song titles.
 * - GetRelatedSongsInput - The input type for the getRelatedSongs function.
 * - GetRelatedSongsOutput - The return type for the getRelatedSongs function.
 */
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GetRelatedSongsInputSchema = z.object({
  songTitle: z.string().describe('The title of the seed song.'),
  mood: z
    .string()
    .describe('The mood of the seed song (e.g., happy, sad, energetic).'),
});
export type GetRelatedSongsInput = z.infer<typeof GetRelatedSongsInputSchema>;

const GetRelatedSongsOutputSchema = z.object({
  queries: z
    .array(z.string())
    .describe(
      'A list of 5 diverse song titles that are similar in mood and genre to the seed song. Do not include the seed song in this list. The titles should be varied.'
    ),
});
export type GetRelatedSongsOutput = z.infer<typeof GetRelatedSongsOutputSchema>;

export async function getRelatedSongs(
  input: GetRelatedSongsInput
): Promise<GetRelatedSongsOutput> {
  return getRelatedSongsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRelatedSongsPrompt',
  input: {schema: GetRelatedSongsInputSchema},
  output: {schema: GetRelatedSongsOutputSchema},
  prompt: `You are a music recommendation expert. Given a song title and its mood, your task is to suggest 5 other songs that have a similar vibe.

Seed Song: "{{songTitle}}"
Mood: "{{mood}}"

Instructions:
1.  Generate a list of exactly 5 song titles.
2.  The recommended songs should match the mood: {{mood}}.
3.  The songs should be from a similar genre or style as "{{songTitle}}".
4.  Do NOT include "{{songTitle}}" in your list of recommendations.
5.  Ensure the recommendations are diverse and not just from the same artist.
6.  Your response MUST contain only the list of song titles in the 'queries' field.`,
});

const getRelatedSongsFlow = ai.defineFlow(
  {
    name: 'getRelatedSongsFlow',
    inputSchema: GetRelatedSongsInputSchema,
    outputSchema: GetRelatedSongsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
