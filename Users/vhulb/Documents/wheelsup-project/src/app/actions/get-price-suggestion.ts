
'use server';

import { predictRidePrice, PredictRidePriceInput, PredictRidePriceOutput } from '../../ai/flows/predict-ride-price';

export type PriceSuggestion = PredictRidePriceOutput;

export async function getPriceSuggestion(input: PredictRidePriceInput): Promise<PriceSuggestion | null> {
    try {
        const result = await predictRidePrice(input);
        return result;
    } catch (error) {
        console.error("Error fetching price suggestion:", error);
        return null;
    }
}
