
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Ride, Conversation, Message } from '../lib/types';
import { initialRides, initialConversations } from '../lib/data';

interface RideContextType {
  rides: Ride[];
  addRide: (ride: Ride) => void;
  updateRide: (rideId: string, updates: Partial<Ride>) => void;
  conversations: Conversation[];
  getConversation: (participants: string[]) => Conversation | undefined;
  sendMessage: (conversationId: string, message: Message) => void;
  createConversation: (newConversation: Conversation) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>(initialRides);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  const addRide = (ride: Ride) => {
    setRides(prevRides => [ride, ...prevRides]);
  };
  
  const updateRide = (rideId: string, updates: Partial<Ride>) => {
    setRides(prevRides => 
        prevRides.map(ride => 
            ride.id === rideId ? { ...ride, ...updates } : ride
        )
    );
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
    <RideContext.Provider value={{ rides, addRide, updateRide, conversations, getConversation, sendMessage, createConversation }}>
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
