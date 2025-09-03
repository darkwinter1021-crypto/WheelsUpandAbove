
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, MessageSquare, PlusCircle, UserCircle, LogOut, LogIn, Menu, Settings, Download, Siren } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { useAuth } from '../contexts/auth-context';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';


const navLinks = [
  { href: '/', label: 'Find a Ride', icon: Car },
  { href: '/post-ride', label: 'Post a Ride', icon: PlusCircle, protected: true },
  { href: '/messages', label: 'Messages', icon: MessageSquare, protected: true },
  { href: '/download', label: 'Download App', icon: Download },
];

function EmergencySOS() {
    const handleSOS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                const subject = "Emergency SOS - WheelsUp";
                const body = `I need help! My approximate location is: https://www.google.com/maps?q=${latitude},${longitude}`;
                window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
            }, () => {
                 // Geolocation failed
                const subject = "Emergency SOS - WheelsUp";
                const body = `I need help! My location could not be determined.`;
                window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
            });
        } else {
            // Geolocation not supported
            const subject = "Emergency SOS - WheelsUp";
            const body = `I need help! My location could not be determined.`;
            window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="rounded-full h-10 w-10">
                    <Siren className="h-5 w-5" />
                    <span className="sr-only">SOS</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Emergency SOS</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will open your default email client to send an emergency message with your location to a contact of your choice. This is NOT a substitute for calling emergency services.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSOS} className="bg-destructive hover:bg-destructive/90">
                        Proceed
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function AppHeader() {
  const pathname = usePathname();
  const { user, dbUser, loading } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="p-4 border-b">
             <Link href="/" className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-primary" />
                <span className="font-bold font-headline text-2xl">WheelsUp</span>
            </Link>
        </div>
        <nav className="flex flex-col gap-2 p-4 flex-1">
          {navLinks.map(({ href, label, icon: Icon, protected: isProtected }) => {
            if (isProtected && !user) return null;
            return (
              <SheetClose key={href} asChild>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-md p-3 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === href ? 'bg-accent text-accent-foreground' : ''
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
         {!loading && (
           <div className="p-4 border-t">
            {user ? (
               <Button variant="outline" onClick={handleLogout} className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
            ) : (
              <div className="flex flex-col gap-2">
                 <SheetClose asChild>
                  <Link href="/login" passHref>
                      <Button variant="outline" className="w-full">
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                      </Button>
                  </Link>
                </SheetClose>
                 <SheetClose asChild>
                  <Link href="/signup" passHref>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                          Sign Up
                      </Button>
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>
         )}
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="hidden sm:inline font-bold font-headline text-2xl">WheelsUp</span>
        </Link>
        <nav className="flex-1 items-center space-x-6 hidden md:flex">
          {navLinks.map(({ href, label }) => (
             <Link
              key={href}
              href={href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === href ? 'text-primary' : 'text-foreground/60'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        
        <div className="flex-1 flex justify-end items-center space-x-2 md:space-x-4">
          <EmergencySOS />
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          {!loading && user && dbUser && (
            <>
              <Button asChild variant="ghost">
                <Link href="/post-ride">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post a Ride
                </Link>
              </Button>
              <Button asChild variant="ghost" className={cn(pathname === '/messages' && 'bg-accent/50')}>
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className='h-9 w-9'>
                      <AvatarImage src={dbUser.avatarUrl} alt={dbUser.name} />
                      <AvatarFallback>{dbUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{dbUser.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{dbUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" />Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                     <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
           {!loading && !user && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                 <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
