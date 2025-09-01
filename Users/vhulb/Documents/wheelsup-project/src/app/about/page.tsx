
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { CheckCircle, ShieldCheck, MessageSquare, Users } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Easy & Secure Booking',
    description: 'Find and book your ride in just a few clicks. Our secure platform ensures your details are safe.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Verified Members',
    description: 'Travel with confidence. Our phone verification process adds a layer of trust and safety to our community.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'In-App Messaging',
    description: 'Coordinate easily with drivers and passengers using our built-in secure messaging system.',
  },
   {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Community Focused',
    description: 'Join a community of friendly travelers, share stories, and make your commute more enjoyable.',
  },
];

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-card border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 text-primary">Welcome to WheelsUp</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your friendly, affordable, and community-driven carpooling platform. We connect passengers with drivers heading in the same direction.
          </p>
          <div className="flex gap-4 justify-center">
             <Button asChild size="lg">
                <Link href="/">Find a Ride</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
                <Link href="/post-ride">Offer a Ride</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
       <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-headline mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">1</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-2">Search for a Ride</h3>
                        <p className="text-muted-foreground">Enter your origin, destination, and travel date to find available rides shared by other members of our community.</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">2</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-2">Book Your Seat</h3>
                        <p className="text-muted-foreground">Choose a ride that suits your schedule and budget. Book your seat instantly and securely through the app.</p>
                    </CardContent>
                </Card>
                 <Card className="border-0 shadow-none">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">3</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-2">Travel Together</h3>
                        <p className="text-muted-foreground">Meet your driver, enjoy the journey, and save money. It's carpooling made simple, safe, and social.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
       </section>

      {/* Features Section */}
      <section className="py-16 bg-card border-t border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-headline mb-12 text-center">Why Choose WheelsUp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-transparent border-0 shadow-none">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg font-semibold mb-2">{feature.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-headline mb-4">Ready to Join the Community?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're looking to save on your daily commute or planning a long-distance trip, WheelsUp is here to help.
            </p>
            <Button asChild size="lg">
                <Link href="/signup">Sign Up for Free</Link>
            </Button>
         </div>
      </section>
    </div>
  );
}
