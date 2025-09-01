
'use server';

import type { User } from '../../lib/types';
import { generateUserProfile } from '../../ai/flows/generate-user-profile';

export async function getProfileSummary(user: User): Promise<string> {
    try {
        const rideHistoryText = `Driver: ${user.ridesAsDriver} rides, Passenger: ${user.ridesAsPassenger} rides. Member since ${new Date(user.memberSince).toLocaleDateString()}.`;
        const summary = await generateUserProfile({
            userName: user.name,
            averageRating: user.rating,
            rideHistory: rideHistoryText,
        });
        return summary.profileSummary;
    } catch (e) {
        console.error("Failed to generate profile summary:", e);
        return 'A friendly and reliable member of the WheelsUp community.';
    }
}
