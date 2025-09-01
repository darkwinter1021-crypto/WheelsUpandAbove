
import type { User, Ride, Conversation } from './types';

// Initial user data. In a real app, this would come from a database.
// We are keeping this to bootstrap user profiles on login.
export const users: User[] = [
  {
    id: 'user_1',
    name: 'Arjun Reddy',
    email: 'arjun@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    rating: 4.9,
    ridesAsDriver: 25,
    ridesAsPassenger: 10,
    isVerified: true,
    memberSince: '2022-08-15',
    bio: 'Loves long drives and good music. Clean and reliable car.',
    phoneNumber: '9876543210',
    vehicle: 'Honda City'
  },
  {
    id: 'user_2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    rating: 4.8,
    ridesAsDriver: 5,
    ridesAsPassenger: 32,
    isVerified: true,
    memberSince: '2023-01-20',
    bio: 'Friendly and chatty passenger. Always on time.',
    vehicle: 'Maruti Swift'
  },
  {
    id: 'user_3',
    name: 'Rohan Patel',
    email: 'rohan@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    rating: 4.7,
    ridesAsDriver: 40,
    ridesAsPassenger: 5,
    isVerified: false,
    memberSince: '2021-11-30',
    phoneNumber: '9876543211',
    vehicle: 'Hyundai Verna'
  },
];

export const mhtLocations = [
    'Gate 1',
    'Gate 2',
    'Tower 1 B1',
    'Tower 2 B1',
    'Tower 3 B1',
    'Tower 4 B1',
    'Tower 5 B1',
    'Tower 6 B1',
    'Tower 7 B1',
    'Tower 8 B1',
    'Tower 9 B1',
];

// Initial ride data to populate the app.
// In a real application, this would be fetched from a database.
export const initialRides: Ride[] = [
    {
        id: 'ride_1',
        driver: users[0],
        origin: 'Gate 1',
        destination: 'Banjara Hills',
        originCoords: [17.4401, 78.3489],
        destinationCoords: [17.4162, 78.4457],
        departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        availableSeats: 2,
        price: 150,
    },
    {
        id: 'ride_2',
        driver: users[2],
        origin: 'Tower 5 B1',
        destination: 'Ameerpet',
        originCoords: [17.4944, 78.3996],
        destinationCoords: [17.4375, 78.4483],
        departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        availableSeats: 3,
        price: 100,
    },
];

// No initial conversations. They will be created dynamically.
export const initialConversations: Conversation[] = [];

// Alias for compatibility
export const rides = initialRides;
