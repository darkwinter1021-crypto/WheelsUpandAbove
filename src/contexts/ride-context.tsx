
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Ride, Conversation, Message } from '../lib/types';
import { initialConversations } from '../lib/data';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

interface RideContextType {
  rides: Ride[];
  loading: boolean;
  addRide: (ride: Omit<Ride, 'id'>) => Promise<string>;
  updateRide: (rideId: string, updates: Partial<Ride>) => Promise<void>;
  conversations: Conversation[];
  getConversation: (participants: string[]) => Conversation | undefined;
  sendMessage: (conversationId: string, message: Message) => void;
  createConversation: (newConversation: Conversation) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  // Fetch rides from Firestore on component mount
  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const ridesQuery = query(collection(db, 'rides'), orderBy('createdAt', 'desc'));
        
        // Set up real-time listener for rides collection
        const unsubscribe = onSnapshot(ridesQuery, (snapshot) => {
          const ridesData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              departureTime: data.departureTime ? data.departureTime.toDate() : new Date(), // Convert Firestore timestamp to Date with fallback
              driver: data.driver // Assuming driver data is stored directly
            } as Ride;
          });
          setRides(ridesData);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching rides:", error);
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up rides listener:", error);
        setLoading(false);
      }
    };
    
    fetchRides();
  }, []);

  const addRide = async (ride: Omit<Ride, 'id'>) => {
    try {
      // Add the ride to Firestore
      const rideData = {
        ...ride,
        createdAt: serverTimestamp()
      };
      
      // Add the ride to Firestore
      const docRef = await addDoc(collection(db, 'rides'), rideData);
      
      // Return the new ride ID
      return docRef.id;
    } catch (error) {
      console.error('Error adding ride:', error);
      throw error;
    }
  };
  
  const updateRide = async (rideId: string, updates: Partial<Ride>) => {
    try {
      const rideRef = doc(db, 'rides', rideId);
      await updateDoc(rideRef, updates);
      
      // Update local state to reflect changes
      setRides(prevRides => 
        prevRides.map(ride => 
          ride.id === rideId ? { ...ride, ...updates } : ride
        )
      );
    } catch (error) {
      console.error("Error updating ride:", error);
      throw error;
    }
  };

  const getConversation = (participants: string[]) => {
    return conversations.find(c => 
      c.participants.length === participants.length &&
      c.participants.every(p => participants.includes(p.id))
    );
  };

  const createConversation = (newConversation: Conversation) => {
    setConversations(prev => [newConversation, ...prev]);
  };

  const sendMessage = (conversationId: string, message: Message) => {
    setConversations(prev => prev.map(convo => {
      if (convo.id === conversationId) {
        return {
          ...convo,
          messages: [...convo.messages, message]
        };
      }
      return convo;
    }));
  };


  return (
    <RideContext.Provider value={{ rides, loading, addRide, updateRide, conversations, getConversation, sendMessage, createConversation }}>
      {children}
    </RideContext.Provider>
  );
};

export const useRides = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRides must be used within a RideProvider');
  }
  return context;
};
