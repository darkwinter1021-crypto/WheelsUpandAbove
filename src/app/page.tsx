
'use client';

import { RideCard } from '../components/ride-card';
import { RideSearchForm } from '../components/ride-search-form';
import { useRides } from '../contexts/ride-context';
import type { Ride } from '../lib/types';
import { Car, Loader2, Users } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';


function CommunityCounter() {
    const [count, setCount] = useState<number | null>(null); 

    useEffect(() => {
        const counterRef = doc(db, 'analytics', 'visitorCounter');
        const hasVisitedKey = 'wheelsup_has_visited_db_real_v2';

        const getAndIncrementCount = async () => {
            try {
                let docSnap = await getDoc(counterRef);
                
                if (!docSnap.exists()) {
                    await setDoc(counterRef, { visitorCount: 0 });
                    docSnap = await getDoc(counterRef); 
                }

                let currentCount = docSnap.data()?.visitorCount || 0;
                const hasVisited = localStorage.getItem(hasVisitedKey);

                if (!hasVisited) {
                    await updateDoc(counterRef, {
                        visitorCount: increment(1)
                    });
                    localStorage.setItem(hasVisitedKey, 'true');
                    currentCount++;
                }
                setCount(currentCount);

            } catch (error) {
                console.error("Error with visitor counter:", error);
                setCount(25); 
            }
        };

        getAndIncrementCount();
    }, []);

    return (
        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground h-6">
            {count !== null ? (
                <>
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{count}</span> community members visited the site
                </>
            ) : (
                 <div className="h-5 w-48 bg-muted rounded-md animate-pulse" />
            )}
        </div>
    );
}


function RideList() {
    const searchParams = useSearchParams();
    const { rides: allRides, loading } = useRides();

    const availableRides = (() => {
        const origin = searchParams.get('origin') || '';
        const destination = searchParams.get('destination')?.toLowerCase() || '';
        const date = searchParams.get('date') || '';

        if (!origin && !destination && !date) {
            return allRides;
        }

        return allRides.filter((ride) => {
            const rideDate = new Date(ride.departureTime);
            const searchDate = date ? new Date(date) : null;
            
            const originMatch = !origin || ride.origin === origin;
            const destinationMatch = !destination || ride.destination.toLowerCase().includes(destination);
            const dateMatch = !searchDate || rideDate.toDateString() === searchDate.toDateString();
            
            return originMatch && destinationMatch && dateMatch;
        });
    })();

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold font-headline mb-8 text-center">Available Rides</h2>
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <span className="ml-4 text-lg">Loading rides...</span>
                    </div>
                ) : availableRides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {availableRides.map((ride) => (
                            <RideCard key={ride.id} ride={ride} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">
                        <Car className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                        <h3 className="text-lg font-semibold text-foreground">No rides match your search.</h3>
                        <p className="mt-2">Try adjusting your search criteria or check back later.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function RideListSkeleton() {
    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold font-headline mb-8 text-center">Finding Rides...</h2>
                 <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </div>
        </section>
    )
}


export default function Home() {
  return (
    <div className="w-full">
      <section className="py-20 md:py-32 bg-card border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Find Your Next Ride</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your journey, your way. Search for rides shared by our trusted community members.
          </p>
          <div className="max-w-4xl mx-auto">
             <Suspense>
                <RideSearchForm />
             </Suspense>
          </div>
          <CommunityCounter />
        </div>
      </section>

      <Suspense fallback={<RideListSkeleton />}>
        <RideList />
      </Suspense>
    </div>
  );
}
