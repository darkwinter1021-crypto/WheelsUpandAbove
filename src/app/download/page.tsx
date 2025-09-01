
'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Download, Sparkles, ShieldCheck, MessageSquare, Share2, AppWindow, ArrowDown } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'AI Price Suggestions',
    description: 'Get fair and competitive prices for your rides with our smart AI-powered suggestions.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Verified Community',
    description: 'Travel with confidence knowing our community is phone-verified for added trust and safety.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'In-App Messaging',
    description: 'Coordinate ride details easily and securely with our built-in private messaging system.',
  },
   {
    icon: <Download className="h-8 w-8 text-primary" />,
    title: 'Installable App',
    description: 'Get a native app-like experience by installing WheelsUp directly to your homescreen.',
  },
];


export default function DownloadPage() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      (installPrompt as any).prompt();
      (installPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
      });
    }
  };


  return (
    <div className="w-full">
      <section className="py-20 md:py-32 bg-card border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 mb-6">
            <AppWindow className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 text-primary">Install WheelsUp</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get a faster, more integrated experience by adding WheelsUp directly to your home screen. No app store needed!
          </p>
          {installPrompt && (
            <Button size="lg" onClick={handleInstallClick}>
              <Download className="mr-2 h-5 w-5" />
              Install App
            </Button>
          )}
          {!installPrompt && <p className="text-sm mt-4 text-muted-foreground">Follow the instructions for your browser below.</p>}
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-headline mb-12 text-center">How to Install</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <Image src="https://unpkg.com/lucide-static@latest/icons/chrome.svg" alt="Android Chrome" width={24} height={24} />
                             For Android (Chrome)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-muted-foreground">
                       <p>1. If you see it, tap the <span className="font-semibold text-foreground">"Install App"</span> button above.</p>
                       <p>2. If not, tap the <span className="font-semibold text-foreground">three-dot menu</span> icon in Chrome.</p>
                       <p>3. Select <span className="font-semibold text-foreground">"Install app"</span> or <span className="font-semibold text-foreground">"Add to Home screen"</span>.</p>
                       <p>4. Follow the on-screen instructions to finish.</p>
                    </CardContent>
                </Card>
                
                 <Card className="shadow-lg">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Image src="https://unpkg.com/lucide-static@latest/icons/safari.svg" alt="iOS Safari" width={24} height={24} />
                           For iOS (Safari)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-muted-foreground">
                       <p>1. Tap the <span className="font-semibold text-foreground">"Share"</span> button in the Safari toolbar.</p>
                        <div className='text-center py-2'>
                           <Share2 className="h-6 w-6 inline-block text-blue-500" />
                        </div>
                       <p>2. Scroll down and tap <span className="font-semibold text-foreground">"Add to Home Screen"</span>.</p>
                       <p>3. Confirm the name and tap <span className="font-semibold text-foreground">"Add"</span>.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
       </section>

      <section className="py-16 bg-card border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-headline mb-12 text-center">App Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-transparent border-0 shadow-none">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
    </div>
  );
}
