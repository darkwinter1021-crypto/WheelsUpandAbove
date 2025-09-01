
'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon, MapPin, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { mhtLocations } from '../lib/data';


export function RideSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params to keep form in sync
  const [origin, setOrigin] = useState(searchParams.get('origin') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (origin) params.set('origin', origin); else params.delete('origin');
    if (destination) params.set('destination', destination); else params.delete('destination');
    if (date) params.set('date', date.toISOString().split('T')[0]); else params.delete('date');
    router.push(`/?${params.toString()}`);
  }


  return (
    <div className="p-4 bg-card rounded-lg shadow-lg border">
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end" onSubmit={handleSearch}>
        <div className="space-y-2 md:col-span-2 lg:col-span-1">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Origin
          </label>
           <Select onValueChange={setOrigin} value={origin}>
              <SelectTrigger>
                <SelectValue placeholder="Select pickup spot" />
              </SelectTrigger>
              <SelectContent>
                  {mhtLocations.map(location => <SelectItem key={location} value={location}>{location}</SelectItem>)}
              </SelectContent>
            </Select>
          <p className="text-xs text-muted-foreground pt-1">This App is only for MHT and in the future More Destinations and pick up spots will be availbile</p>
        </div>
        <div className="space-y-2 md:col-span-2 lg:col-span-1">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Destination
          </label>
          <Input type="text" placeholder="e.g., Gachibowli" value={destination} onChange={e => setDestination(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
             <CalendarIcon className="h-4 w-4 mr-2" />
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Any day</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <Button type="submit" size="lg" className="w-full md:w-auto h-12 md:h-10">
          <Search className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Search Rides</span>
        </Button>
      </form>
    </div>
  );
}
