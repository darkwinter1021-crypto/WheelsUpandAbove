
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, IndianRupee, MapPin, MessageSquare, Phone, Users, Check } from 'lucide-react';
import { RideMap as RideMapComponent } from '@/components/ride-map';
import { useEffect, useState } from 'react';
import type { Ride } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRides } from '@/contexts/ride-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const RideMap = dynamic(() => import('@/components/ride-map').then(mod => mod.RideMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});


export default function RideDetailPage() {
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { rides, updateRide } = useRides();
  const { toast } = useToast();
  const { user, dbUser } = useAuth();
  
  const rideId = typeof params.id === 'string' ? params.id : '';
  const ride = rides.find(r => r.id === rideId);

  if (!ride) {
    return <div className="container mx-auto px-4 py-12">Ride not found.</div>;
  }
  
  const { driver, origin, destination, originCoords, destinationCoords, departureTime, availableSeats, price } = ride;
  const departureDate = new Date(departureTime).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const departureTimeStr = new Date(departureTime).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const handleMessage = () => {
    if (!user) {
        router.push('/login');
        return;
    }
    router.push(`/messages?chatWith=${driver.id}&rideId=${ride.id}`);
  };

  const handleCall = () => {
    if (!user) {
        router.push('/login');
        return;
    }
    if (driver.phoneNumber) {
      window.location.href = `tel:${driver.phoneNumber}`;
    } else {
      toast({
        title: "No Phone Number",
        description: `${driver.name.split(' ')[0]} has not provided a phone number.`,
        variant: "destructive",
      });
    }
  };
  
  const handleBook = () => {
     if (!user) {
        router.push('/login');
        return;
    }
    setShowBookingConfirm(true);
  }
  
  const confirmBooking = () => {
      if (ride.availableSeats > 0) {
          updateRide(ride.id, { availableSeats: ride.availableSeats - 1 });
          toast({
              title: "Booking Confirmed!",
              description: "Your seat is booked. Happy travels!",
              className: 'bg-primary text-primary-foreground',
          });
          setShowBookingConfirm(false);
      }
  }

  const isMyRide = dbUser?.id === driver.id;

  return (
    <>
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-[300px] md:h-[400px] lg:h-full w-full overflow-hidden rounded-lg shadow-lg">
            <RideMap origin={originCoords} destination={destinationCoords} />
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center justify-between">
                <span>Ride Details</span>
                <span className="text-2xl font-bold text-primary flex items-center">
                  {price === 'Free' ? 'Free' : <> <IndianRupee className="h-6 w-6 mr-1" />{price}</>}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{origin}</p>
                  <p className="text-xs">Origin</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{destination}</p>
                  <p className="text-xs">Destination</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{departureDate}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <span>{departureTimeStr}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <span>{availableSeats > 0 ? `${availableSeats} seats available` : 'No seats available'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
             <CardHeader className="flex flex-row items-center space-x-4">
                 <Link href={`/profile/${driver.id}`} className="cursor-pointer">
                    <Avatar className="h-16 w-16 border-2 border-primary/50">
                        <AvatarImage src={driver.avatarUrl} data-ai-hint="portrait person" />
                        <AvatarFallback>{driver.name.charAt(0)}</Fallback>
                    </Avatar>
                 </Link>
                <div>
                    <Link href={`/profile/${driver.id}`} className="cursor-pointer">
                        <CardTitle className="text-xl font-headline hover:underline">{driver.name}</CardTitle>
                    </Link>
                    <p className="text-sm text-muted-foreground">Rating: {driver.rating} ★</p>
                     {driver.isVerified && (
                        <div className="flex items-center text-xs text-primary mt-1">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified Driver
                        </div>
                    )}
                </div>
             </CardHeader>
             <CardContent className="space-y-2">
                <Button onClick={handleBook} className="w-full transition-transform hover:scale-105" disabled={availableSeats === 0 || isMyRide}>
                  {isMyRide ? "This is your ride" : (availableSeats > 0 ? "Book Now" : "Ride Full")}
                </Button>
                <div className="flex gap-2">
                    <Button onClick={handleMessage} variant="outline" className="w-full" disabled={isMyRide}>
                        <MessageSquare className="h-4 w-4 mr-2" /> Message
                    </Button>
                    <Button onClick={handleCall} variant="outline" className="w-full" disabled={!driver.phoneNumber || isMyRide}>
                        <Phone className="h-4 w-4 mr-2" /> Call
                    </Button>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
    
    <AlertDialog open={showBookingConfirm} onOpenChange={setShowBookingConfirm}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm your Booking</AlertDialogTitle>
                <AlertDialogDescription>
                    You are about to book a seat for the ride from <span className="font-semibold text-primary">{ride.origin}</span> to <span className="font-semibold text-primary">{ride.destination}</span>.
                </AlertDialogDescription>
            </AlertDialogHeader>
             <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmBooking}>
                    <Check className='mr-2 h-4 w-4' /> Confirm
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
