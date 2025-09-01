
'use server';

/**
 * @fileOverview User profile generation flow.
 *
 * - generateUserProfile - A function that generates a user profile summary.
 * - GenerateUserProfileInput - The input type for the generateUserProfile function.
 * - GenerateUserProfileOutput - The return type for the generateUserProfile function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const GenerateUserProfileInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  rideHistory: z.string().describe('A summary of the user\'s ride history.'),
  averageRating: z.number().describe('The average rating of the user.'),
});

export type GenerateUserProfileInput = z.infer<typeof GenerateUserProfileInputSchema>;

const GenerateUserProfileOutputSchema = z.object({
  profileSummary: z.string().describe('A short summary of the user profile.'),
});

export type GenerateUserProfileOutput = z.infer<typeof GenerateUserProfileOutputSchema>;

export async function generateUserProfile(input: GenerateUserProfileInput): Promise<GenerateUserProfileOutput> {
  return generateUserProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUserProfilePrompt',
  input: {schema: GenerateUserProfileInputSchema},
  output: {schema: GenerateUserProfileOutputSchema},
  prompt: `You are an AI assistant specializing in generating user profiles for a ride-sharing application.

  Given the following information about a user, generate a short, engaging, and positive profile summary highlighting their credibility within the community.

  User Name: {{{userName}}}
  Ride History: {{{rideHistory}}}
  Average Rating: {{{averageRating}}}

  Profile Summary:`, 
});

const generateUserProfileFlow = ai.defineFlow(
  {
    name: 'generateUserProfileFlow',
    inputSchema: GenerateUserProfileInputSchema,
    outputSchema: GenerateUserProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
