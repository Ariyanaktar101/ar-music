'use server';
/**
 * @fileOverview A flow to generate cover art for a playlist.
 *
 * - generatePlaylistArt - Generates an image URL for a playlist cover.
 * - GeneratePlaylistArtInput - The input type for the generatePlaylistArt function.
 * - GeneratePlaylistArtOutput - The return type for the generatePlaylistArt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePlaylistArtInputSchema = z.object({
  playlistName: z.string().describe('The name of the playlist.'),
});
export type GeneratePlaylistArtInput = z.infer<typeof GeneratePlaylistArtInputSchema>;

const GeneratePlaylistArtOutputSchema = z.object({
  imageUrl: z.string().optional().describe('The data URI of the generated image.'),
});
export type GeneratePlaylistArtOutput = z.infer<typeof GeneratePlaylistArtOutputSchema>;

export async function generatePlaylistArt(
  input: GeneratePlaylistArtInput
): Promise<GeneratePlaylistArtOutput> {
  return generatePlaylistArtFlow(input);
}

const generatePlaylistArtFlow = ai.defineFlow(
  {
    name: 'generatePlaylistArtFlow',
    inputSchema: GeneratePlaylistArtInputSchema,
    outputSchema: GeneratePlaylistArtOutputSchema,
  },
  async (input) => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate an abstract, vibrant, and artistic album cover for a music playlist called "${input.playlistName}". The style should be modern, minimalist, and visually striking, using a mix of bold colors and fluid shapes. Do not include any text.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (media?.url) {
        return { imageUrl: media.url };
      }
      return {};
    } catch (error) {
      console.error('Error generating playlist art:', error);
      return {};
    }
  }
);
