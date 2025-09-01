
'use client';

import { useAuth } from '../../contexts/auth-context';
import { getProfileSummary } from '../../app/actions/get-profile-summary';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StarRating } from '../../components/star-rating';
import { ShieldCheck, MessageSquare, Phone, Car } from 'lucide-react';
import { RideCard } from '../../components/ride-card';
import { Separator } from '../../components/ui/separator';
import { useEffect, useState } from 'react';
import { Skeleton } from '../../components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { rides as allRides } from '../../lib/data';
import type { Ride } from '../../lib/types';
import Link from 'next/link';


export default function ProfilePage() {
    const { dbUser } = useAuth();
    const [profileSummary, setProfileSummary] = useState<string>('Loading profile...');
    const [userRides, setUserRides] = useState<Ride[]>([]);
    const router = useRouter();
    
    useEffect(() => {
        if (dbUser) {
            getProfileSummary(dbUser).then(setProfileSummary);
            setUserRides(allRides.filter(ride => ride.driver.id === dbUser.id));
        }
    }, [dbUser]);
    
    if (!dbUser) {
        return (
             <div className="bg-secondary/40">
                <div className="container mx-auto px-4 py-12">
                     <Skeleton className="h-96 w-full" />
                </div>
             </div>
        );
    }

    return (
        <div className="bg-secondary/40 min-h-full">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="shadow-lg">
                            <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center">
                                <Avatar className="h-32 w-32 border-4 border-primary/50 mb-4">
                                    <AvatarImage src={dbUser.avatarUrl} alt={dbUser.name} data-ai-hint="portrait person" />
                                    <AvatarFallback className="text-4xl">{dbUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h1 className="text-3xl font-bold font-headline">{dbUser.name}</h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <StarRating rating={dbUser.rating} />
                                    <span className="text-muted-foreground">({dbUser.rating})</span>
                                </div>
                                {dbUser.isVerified && (
                                    <Badge variant="default" className="mt-4 bg-primary/20 text-primary border-primary/50 hover:bg-primary/30">
                                        <ShieldCheck className="h-4 w-4 mr-1.5" />
                                        Verified Member
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>About {dbUser.name.split(' ')[0]}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-4">
                               <p className="italic">"{profileSummary}"</p>
                               <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between"><span>Rides as Driver:</span> <span className="font-medium">{dbUser.ridesAsDriver}</span></div>
                                    <div className="flex justify-between"><span>Rides as Passenger:</span> <span className="font-medium">{dbUser.ridesAsPassenger}</span></div>
                                    <div className="flex justify-between"><span>Member Since:</span> <span className="font-medium">{new Date(dbUser.memberSince).toLocaleDateString()}</span></div>
                                    <div className="flex justify-between">
                                        <span>Phone:</span>
                                        {dbUser.isVerified ? 
                                            <span className="font-medium text-primary flex items-center"><ShieldCheck className="h-4 w-4 mr-1.5" /> Verified</span> :
                                            <Button variant="link" className="h-auto p-0" onClick={() => {/* TODO: Open verification modal */}}>Verify Now</Button>
                                        }
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold font-headline mb-4">My Offered Rides</h2>
                        <div className="space-y-6">
                            {userRides.length > 0 ? (
                                userRides.map(ride => <RideCard key={ride.id} ride={ride} />)
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center text-muted-foreground">
                                        <Car className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                                        <h3 className="text-lg font-semibold text-foreground">You haven't offered any rides yet.</h3>
                                        <p className="mt-2 mb-4">Share your upcoming trips to find passengers and save on travel costs.</p>
                                        <Button asChild>
                                            <Link href="/post-ride">Post a Ride</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
