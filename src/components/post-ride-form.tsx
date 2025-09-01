
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Car, Clock, DollarSign, MapPin, Sparkles, Users } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useToast } from '../hooks/use-toast';
import { getPriceSuggestion } from '../app/actions/get-price-suggestion';
import type { PriceSuggestion } from '../app/actions/get-price-suggestion';
import { Card } from './ui/card';
import { useRides } from '../contexts/ride-context';
import { useAuth } from '../contexts/auth-context';
import { useRouter } from 'next/navigation';
import { mhtLocations } from '../lib/data';

const formSchema = z.object({
  origin: z.string().min(1, { message: 'Please select an origin.' }),
  destination: z.string().min(2, { message: 'Destination must be at least 2 characters.' }),
  departureDate: z.date({ required_error: 'A departure date is required.' }),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  availableSeats: z.coerce.number().min(1).max(8),
  priceOption: z.enum(['free', 'paid']),
  price: z.coerce.number().optional(),
}).refine(data => {
    if (data.priceOption === 'paid') {
        return data.price !== undefined && data.price > 0;
    }
    return true;
}, {
    message: "Price must be a positive number for paid rides.",
    path: ["price"],
});

export function PostRideForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null);
  const { toast } = useToast();
  const { addRide } = useRides();
  const { user, dbUser } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: '',
      destination: '',
      departureTime: '10:00',
      availableSeats: 2,
      priceOption: 'paid',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (!user || !dbUser) {
        toast({ title: 'Not Logged In', description: 'You must be logged in to post a ride.', variant: 'destructive' });
        setIsSubmitting(false);
        return;
    }

    const [hours, minutes] = values.departureTime.split(':').map(Number);
    const departureDateTime = new Date(values.departureDate);
    departureDateTime.setHours(hours, minutes);
    
    addRide({
      id: `ride_${Date.now()}`,
      origin: values.origin,
      destination: values.destination,
      departureTime: departureDateTime,
      availableSeats: values.availableSeats,
      price: values.priceOption === 'paid' ? values.price! : 'Free',
      driver: dbUser,
      originCoords: [17.44, 78.34],
      destinationCoords: [17.41, 78.44]
    });

    await new Promise(resolve => setTimeout(resolve, 500)); 
    toast({
        title: "Ride Posted!",
        description: `Your ride from ${values.origin} to ${values.destination} is now live.`,
        variant: 'default',
        className: 'bg-primary text-primary-foreground'
    });
    
    form.reset();
    setIsSubmitting(false);
    router.push('/');
  }
  
  async function handleSuggestPrice() {
      const { origin, destination, departureTime } = form.getValues();
      if (!origin || !destination) {
          toast({ title: 'Origin and Destination required', description: 'Please fill in origin and destination to get a price suggestion.', variant: 'destructive' });
          return;
      }
      setIsSuggestingPrice(true);
      const hour = parseInt(departureTime.split(':')[0], 10);
      const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

      const suggestion = await getPriceSuggestion({
          origin,
          destination,
          distanceMiles: 15,
          timeOfDay,
          demandLevel: 'medium',
      });
      setPriceSuggestion(suggestion);
      setIsSuggestingPrice(false);
  }

  return (
    <>
      <Card className="p-6 sm:p-8 shadow-2xl">
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center'><MapPin className="h-4 w-4 mr-2" />Origin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pickup spot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {mhtLocations.map(location => <SelectItem key={location} value={location}>{location}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center'><MapPin className="h-4 w-4 mr-2" />Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gachibowli" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                  <FormItem className="flex flex-col">
                      <FormLabel className='flex items-center'><CalendarIcon className="h-4 w-4 mr-2" />Departure Date</FormLabel>
                      <Popover>
                      <PopoverTrigger asChild>
                          <FormControl>
                          <Button
                              variant={'outline'}
                              className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                          </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                          />
                      </PopoverContent>
                      </Popover>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="departureTime"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel className='flex items-center'><Clock className="h-4 w-4 mr-2" />Departure Time</FormLabel>
                          <FormControl>
                              <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
          </div>

          <FormField
              control={form.control}
              name="availableSeats"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className='flex items-center'><Users className="h-4 w-4 mr-2" />Available Seats</FormLabel>
                  <FormControl>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select number of seats" />
                          </SelectTrigger>
                          <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(seat => <SelectItem key={seat} value={String(seat)}>{seat}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="priceOption"
              render={({ field }) => (
              <FormItem className="space-y-3">
                  <FormLabel className='flex items-center'><DollarSign className="h-4 w-4 mr-2" />Price</FormLabel>
                  <FormControl>
                  <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                  >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                          <RadioGroupItem value="free" />
                      </FormControl>
                      <FormLabel className="font-normal">Ride is Free</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                          <RadioGroupItem value="paid" />
                      </FormControl>
                      <FormLabel className="font-normal">Set a Price per Seat</FormLabel>
                      </FormItem>
                  </RadioGroup>
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
          
          {form.watch('priceOption') === 'paid' && (
              <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Price per seat (INR)</FormLabel>
                          <div className="flex gap-2">
                          <FormControl>
                              <Input type="number" placeholder="e.g., 150" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                          </FormControl>
                          <Button type="button" variant="outline" onClick={handleSuggestPrice} disabled={isSuggestingPrice}>
                          <Sparkles className="mr-2 h-4 w-4 text-yellow-500" /> {isSuggestingPrice ? 'Thinking...' : 'Suggest Price'}
                          </Button>
                          </div>
                      <FormDescription>Our AI can help you find a competitive price.</FormDescription>
                      <FormMessage />
                      </FormItem>
                  )}
              />
          )}


          <Button type="submit" className="w-full transition-transform hover:scale-105" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Posting Ride...' : 'Post Your Ride'} <Car className="ml-2 h-4 w-4"/>
          </Button>
          </form>
      </Form>
      </Card>

      <AlertDialog open={!!priceSuggestion} onOpenChange={() => setPriceSuggestion(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center'><Sparkles className="mr-2 h-5 w-5 text-yellow-500" /> AI Price Suggestion</AlertDialogTitle>
              <AlertDialogDescription>
                  <p className="py-4">{priceSuggestion?.reasoning}</p>
                  <div className='text-center text-4xl font-bold text-primary'>₹{priceSuggestion?.predictedPrice.toFixed(2)}</div>
                  <p className='text-center text-muted-foreground text-sm'>per seat</p>
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setPriceSuggestion(null)}>Cancel</Button>
                  <AlertDialogAction onClick={() => {
                      form.setValue('price', priceSuggestion?.predictedPrice || 0);
                      setPriceSuggestion(null);
                  }}>
                      Use this Price
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
