
'use client';

import React, { createContext, useContext, useEffect, useState, Suspense } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { users as mockUsers } from '../lib/data';
import type { User } from '../lib/types';
import { Car } from 'lucide-react';

interface AuthContextType {
  user: FirebaseUser | null;
  dbUser: User | null;
  loading: boolean;
  setDbUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({ user: null, dbUser: null, loading: true, setDbUser: () => {} });

const protectedRoutes = ['/profile', '/post-ride', '/messages']; // a user's own profile is protected, public profiles are not

const AuthProviderLayout = ({ children }: { children: React.ReactNode }) => {
    const { loading, user } = useContext(AuthContext);
    const pathname = usePathname();
    const isProtectedRoute = protectedRoutes.some(route => pathname === route);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
                <div className="relative flex items-center justify-center">
                    <Car className="h-16 w-16 text-primary animate-pulse" />
                    <div className="absolute h-24 w-24 border-2 border-primary/50 rounded-full animate-ping"></div>
                </div>
                <p className="mt-4 text-muted-foreground animate-pulse">Loading your profile...</p>
            </div>
        );
    }
    
    if (!user && isProtectedRoute) {
         return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-xl font-semibold">Redirecting to login...</div>
            </div>
          );
    }

    return <>{children}</>;
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setUser(fbUser);
        // In a real app, you'd fetch this from your database.
        // For this demo, we find the user from mock data or create a default one.
        const existingUser = mockUsers.find(u => u.email === fbUser.email);
        if (existingUser) {
            setDbUser(existingUser);
        } else {
            // Create a default user profile if none exists for the new Firebase user.
            const newUser: User = {
                id: fbUser.uid,
                name: fbUser.displayName || 'New User',
                email: fbUser.email!,
                avatarUrl: fbUser.photoURL || `https://placehold.co/100x100.png?text=${(fbUser.displayName || 'U').charAt(0)}`,
                rating: 0,
                ridesAsDriver: 0,
                ridesAsPassenger: 0,
                isVerified: false,
                memberSince: new Date().toISOString(),
                phoneNumber: fbUser.phoneNumber || undefined,
            };
            setDbUser(newUser);
        }
      } else {
        setUser(null);
        setDbUser(null);
      }
      setLoading(false);
      
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
      if (!fbUser && isProtectedRoute) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, setDbUser }}>
        <AuthProviderLayout>{children}</AuthProviderLayout>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
