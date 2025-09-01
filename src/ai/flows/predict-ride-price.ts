
'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting ride prices dynamically based on demand, distance, and time.
 *
 * - predictRidePrice - A function that takes ride details as input and returns a predicted price.
 * - PredictRidePriceInput - The input type for the predictRidePrice function.
 * - PredictRidePriceOutput - The return type for the predictRidePrice function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const PredictRidePriceInputSchema = z.object({
  origin: z.string().describe('Starting location of the ride within Hyderabad.'),
  destination: z.string().describe('Destination of the ride within Hyderabad.'),
  distanceMiles: z.number().describe('Distance of the ride in miles.'),
  timeOfDay: z.string().describe('Time of day the ride will take place (e.g., morning, afternoon, evening, night).'),
  demandLevel: z.string().describe('The current demand level (low, medium, high, very high).'),
});
export type PredictRidePriceInput = z.infer<typeof PredictRidePriceInputSchema>;

const PredictRidePriceOutputSchema = z.object({
  predictedPrice: z.number().describe('The predicted price for the ride in INR.'),
  reasoning: z.string().describe('The reasoning behind the price prediction.'),
});
export type PredictRidePriceOutput = z.infer<typeof PredictRidePriceOutputSchema>;

export async function predictRidePrice(input: PredictRidePriceInput): Promise<PredictRidePriceOutput> {
  return predictRidePriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictRidePricePrompt',
  input: {schema: PredictRidePriceInputSchema},
  output: {schema: PredictRidePriceOutputSchema},
  prompt: `You are a ride pricing expert for Hyderabad, India. Given the following ride details, predict a suitable price for the ride in INR and explain your reasoning.\n\nOrigin: {{{origin}}}\nDestination: {{{destination}}}\nDistance: {{{distanceMiles}}} miles\nTime of Day: {{{timeOfDay}}}\nDemand Level: {{{demandLevel}}}\n\nConsider typical ride prices, demand, traffic conditions (like the Gachibowli flyover rush hour), and other relevant factors specifically for Hyderabad.\n\nYour prediction should include both the predicted price and a brief explanation of your reasoning.`,
});

const predictRidePriceFlow = ai.defineFlow(
  {
    name: 'predictRidePriceFlow',
    inputSchema: PredictRidePriceInputSchema,
    outputSchema: PredictRidePriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
