
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Camera } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import type { User } from '../lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';


export function WelcomeDialog() {
  const { user, dbUser, setDbUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user && dbUser) {
      // Check if user has seen welcome and is not verified
      const hasSeenWelcome = localStorage.getItem(`welcome_${user.uid}`);
      if (!hasSeenWelcome && !dbUser.isVerified) {
        setIsOpen(true);
      }
    }
  }, [user, dbUser]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const closeDialog = () => {
     if (user) {
        localStorage.setItem(`welcome_${user.uid}`, 'true');
    }
    setIsOpen(false);
  }

  const handleSave = () => {
    if (dbUser) {
      const updatedUser: User = { 
        ...dbUser, 
        avatarUrl: newAvatar || dbUser.avatarUrl,
        // Phone number is saved after successful verification
      };
      setDbUser(updatedUser);
      if (newAvatar) {
        toast({ title: 'Profile picture updated!', className: 'bg-primary text-primary-foreground'});
      }
    }
    closeDialog();
  };
  
  const handleVerifyPhone = () => {
    if (phoneNumber.length < 10) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid 10-digit phone number.", variant: "destructive" });
      return;
    }
    // In a real app, you would call your backend to send an SMS.
    setShowVerification(true);
  };
  
  const handleCodeSubmit = () => {
      // In a real app, you'd verify the code with your backend.
      // Here we just simulate it.
      if (verificationCode === "123456") {
          if (dbUser) {
              const updatedUser: User = { 
                ...dbUser,
                avatarUrl: newAvatar || dbUser.avatarUrl,
                phoneNumber, 
                isVerified: true 
              };
              setDbUser(updatedUser);
          }
          toast({ title: "Phone number verified!", className: 'bg-primary text-primary-foreground'});
          setShowVerification(false);
          closeDialog();
      } else {
          toast({ title: "Invalid Code", description: "The code you entered is incorrect.", variant: "destructive" });
      }
  };

  if (!user || !dbUser) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Welcome to WheelsUp, {dbUser.name}!</DialogTitle>
            <DialogDescription>
              Let's get your profile ready. A complete profile builds trust in the community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center space-y-2">
              <p className="font-medium text-sm">1. Choose a profile picture</p>
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/50">
                  <AvatarImage src={newAvatar || dbUser.avatarUrl} alt={dbUser.name} />
                  <AvatarFallback className="text-3xl">{dbUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
               <p className="font-medium text-sm">2. Verify your phone number (Highly Recommended)</p>
               <div className="flex w-full max-w-sm items-center space-x-2">
                <Input 
                    type="tel" 
                    placeholder="Phone number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleVerifyPhone} disabled={!phoneNumber}>Verify</Button>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleSave}>Skip for Now</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showVerification} onOpenChange={setShowVerification}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Enter Verification Code</AlertDialogTitle>
                  <AlertDialogDescription>
                      We've sent a 6-digit code to {phoneNumber}. Please enter it below. (Hint: the code is 123456)
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-2">
                  <Input 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                  />
              </div>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCodeSubmit}>Submit Code</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
