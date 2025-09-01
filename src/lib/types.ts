
export type LatLng = [number, number];

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  rating: number;
  ridesAsDriver: number;
  ridesAsPassenger: number;
  isVerified: boolean;
  memberSince: string;
  bio?: string;
  phoneNumber?: string;
  vehicle?: string;
}

export interface Ride {
  id: string;
  driver: User;
  origin: string;
  destination: string;
  originCoords: LatLng;
  destinationCoords: LatLng;
  departureTime: Date;
  availableSeats: number;
  price: number | 'Free';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  participants: User[];
  rideId: string;
  messages: Message[];
}
