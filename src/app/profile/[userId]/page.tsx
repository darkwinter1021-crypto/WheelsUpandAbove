
'use client';

import { useParams, useRouter } from 'next/navigation';
import { getProfileSummary } from '../../../app/actions/get-profile-summary';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { StarRating } from '../../../components/star-rating';
import { ShieldCheck, MessageSquare, Phone } from 'lucide-react';
import { RideCard } from '../../../components/ride-card';
import { Separator } from '../../../components/ui/separator';
import { useEffect, useState } from 'react';
import { Skeleton } from '../../../components/ui/skeleton';
import { users as allUsers, rides as allRides } from '../../../lib/data';
import type { Ride, User } from '../../../lib/types';


export default function UserProfilePage() {
    const params = useParams();
    const userId = params.userId as string;
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [profileSummary, setProfileSummary] = useState<string>('Loading profile...');
    const [userRides, setUserRides] = useState<Ride[]>([]);
    const router = useRouter();
    
    useEffect(() => {
        const foundUser = allUsers.find(u => u.id === userId);
        setUser(foundUser);
        
        if (foundUser) {
            getProfileSummary(foundUser).then(setProfileSummary);
            setUserRides(allRides.filter(ride => ride.driver.id === foundUser.id));
        } else {
             setUser(null);
        }
    }, [userId]);

    const handleMessage = () => {
        if (user) {
            router.push(`/messages?chatWith=${user.id}`);
        }
    };
    
    const handleCall = () => {
        if (user?.phoneNumber) {
            window.location.href = `tel:${user.phoneNumber}`;
        }
    }

    if (user === undefined) {
        return (
             <div className="bg-secondary/40">
                <div className="container mx-auto px-4 py-12">
                     <Skeleton className="h-96 w-full" />
                </div>
             </div>
        );
    }
    
    if (user === null) {
         return (
             <div className="bg-secondary/40">
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className='text-2xl font-bold'>User not found</h1>
                </div>
             </div>
        );
    }


    return (
        <div className="bg-secondary/40">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="shadow-lg">
                            <CardContent className="p-8 flex flex-col items-center text-center">
                                <Avatar className="h-32 w-32 border-4 border-primary/50 mb-4">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="portrait person" />
                                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <StarRating rating={user.rating} />
                                    <span className="text-muted-foreground">({user.rating})</span>
                                </div>
                                {user.isVerified && (
                                    <Badge variant="default" className="mt-4 bg-primary/20 text-primary border-primary/50 hover:bg-primary/30">
                                        <ShieldCheck className="h-4 w-4 mr-1.5" />
                                        Verified Member
                                    </Badge>
                                )}
                                <div className="flex w-full gap-2 mt-6">
                                <Button onClick={handleMessage} className="flex-1">
                                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                                </Button>
                                <Button onClick={handleCall} variant="outline" className="flex-1" disabled={!user.phoneNumber}>
                                    <Phone className="mr-2 h-4 w-4" /> Call
                                </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>About {user.name.split(' ')[0]}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground space-y-4">
                               <p className="italic">"{profileSummary}"</p>
                               <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between"><span>Rides as Driver:</span> <span className="font-medium">{user.ridesAsDriver}</span></div>
                                    <div className="flex justify-between"><span>Rides as Passenger:</span> <span className="font-medium">{user.ridesAsPassenger}</span></div>
                                    <div className="flex justify-between"><span>Member Since:</span> <span className="font-medium">{new Date(user.memberSince).toLocaleDateString()}</span></div>
                                    {user.phoneNumber && <div className="flex justify-between"><span>Phone:</span> <span className="font-medium">Verified</span></div>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold font-headline mb-4">Rides offered by {user.name.split(' ')[0]}</h2>
                        <div className="space-y-6">
                            {userRides.length > 0 ? (
                                userRides.map(ride => <RideCard key={ride.id} ride={ride} />)
                            ) : (
                                <Card>
                                    <CardContent className="p-8 text-center text-muted-foreground">
                                        {user.name.split(' ')[0]} has no upcoming rides.
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
