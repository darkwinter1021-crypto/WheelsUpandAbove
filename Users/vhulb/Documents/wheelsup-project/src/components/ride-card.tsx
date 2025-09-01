
import type { Ride } from '../lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowRight, Calendar, Car, CheckCircle, Users } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface RideCardProps {
  ride: Ride;
}

export function RideCard({ ride }: RideCardProps) {
  const { driver, origin, destination, departureTime, availableSeats, price } = ride;
  const departureDate = new Date(departureTime).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const departureTimeStr = new Date(departureTime).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 border-transparent hover:border-primary">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-xl truncate">{origin}</CardTitle>
            <ArrowRight className="h-6 w-6 text-muted-foreground mx-2 shrink-0" />
            <CardTitle className="font-headline text-xl truncate text-right">{destination}</CardTitle>
        </div>
        <CardDescription className="flex items-center pt-2 text-primary">
            <Calendar className="mr-2 h-4 w-4" /> {departureDate} at {departureTimeStr}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
         <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>{availableSeats} seats left</span>
            </div>
             <div className="flex items-center font-semibold text-lg text-primary">
                <span>{price === 'Free' ? 'Free' : `₹${price}`}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/30 p-4 flex justify-between items-center">
        <Link href={`/profile/${driver.id}`} className="flex items-center space-x-3 group">
          <Avatar className="border-2 border-primary/50 group-hover:scale-105 transition-transform">
            <AvatarImage src={driver.avatarUrl} alt={driver.name} data-ai-hint="portrait person" />
            <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold flex items-center group-hover:underline">
              {driver.name}
              {driver.isVerified && <CheckCircle className="ml-1.5 h-4 w-4 text-primary" />}
            </p>
            <p className="text-xs text-muted-foreground">Rating: {driver.rating} ★</p>
          </div>
        </Link>
        <Button asChild variant="default" size="sm" className="transition-transform hover:scale-105">
            <Link href={`/ride/${ride.id}`}>View Ride</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
