
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { users as allUsers } from '../../lib/data';
import type { Conversation, Message } from '../../lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { cn } from '../../lib/utils';
import { Send, Car, ArrowRight, Search, User as UserIcon, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../contexts/auth-context';
import { useRides } from '../../contexts/ride-context';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dbUser: currentUser } = useAuth();
  const { conversations, getConversation, createConversation, sendMessage } = useRides();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const myConversations = conversations.filter(c => c.participants.some(p => p.id === currentUser?.id));

  useEffect(() => {
    if (!currentUser) return;

    const userIdToChat = searchParams.get('chatWith');
    const rideId = searchParams.get('rideId');

    if (userIdToChat) {
      const participantIds = [currentUser.id, userIdToChat].sort();
      let conversation = getConversation(participantIds);
      
      if (!conversation) {
        const otherUser = allUsers.find(u => u.id === userIdToChat);
        if (otherUser) {
          const newConversation: Conversation = {
            id: `conv_${participantIds.join('_')}`,
            participants: [currentUser, otherUser].sort((a,b) => a.id.localeCompare(b.id)),
            rideId: rideId || '',
            messages: []
          };
          createConversation(newConversation);
          conversation = newConversation;
        }
      }
      setSelectedConversation(conversation || null);
       // Clean the URL
      router.replace('/messages', undefined);
    } else if (myConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(myConversations[0]);
    }
  }, [searchParams, router, currentUser, getConversation, createConversation, myConversations, selectedConversation]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
    }
  }, [selectedConversation?.messages]);


  const getOtherParticipant = (convo: Conversation) => {
    if (!currentUser) return null;
    return convo.participants.find(p => p.id !== currentUser.id)!;
  };
  
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const message: Message = {
        id: `msg_${Date.now()}`,
        senderId: currentUser.id,
        text: newMessage,
        timestamp: new Date(),
    };

    sendMessage(selectedConversation.id, message);
    setNewMessage('');
  };

  if (!currentUser) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <p className="text-muted-foreground">Please log in to view your messages.</p>
        </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="container mx-auto h-full p-4">
        <Card className="h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 overflow-hidden shadow-xl">
          <div className="md:col-span-1 lg:col-span-1 border-r flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold font-headline">Messages</h2>
            </div>
            <ScrollArea className="flex-1">
              {myConversations.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                    <MessageCircle className="mx-auto h-12 w-12 text-primary/50" />
                    <p className="mt-4">You have no messages yet.</p>
                    <p className="text-sm">Start a conversation from a user's profile or ride page.</p>
                </div>
              )}
              {myConversations.map((convo) => {
                const otherUser = getOtherParticipant(convo);
                if (!otherUser) return null;
                const lastMessage = convo.messages[convo.messages.length - 1];
                return (
                  <div
                    key={convo.id}
                    className={cn(
                      'p-4 flex items-center space-x-3 border-b cursor-pointer transition-colors',
                      selectedConversation?.id === convo.id ? 'bg-primary/10' : 'hover:bg-accent/50'
                    )}
                    onClick={() => setSelectedConversation(convo)}
                  >
                     <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUser.avatarUrl} data-ai-hint="portrait person" />
                        <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                       {selectedConversation?.id === convo.id && (
                        <div className="absolute top-0 left-0 -ml-1 h-full w-1.5 bg-primary rounded-r-full" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold truncate">{otherUser.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{lastMessage?.text || 'No messages yet'}</p>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                    <div className='flex items-center space-x-3'>
                      <Link href={`/profile/${getOtherParticipant(selectedConversation)!.id}`}>
                        <Avatar>
                          <AvatarImage src={getOtherParticipant(selectedConversation)!.avatarUrl} data-ai-hint="portrait person" />
                          <AvatarFallback>{getOtherParticipant(selectedConversation)!.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Link>
                        <div>
                        <Link href={`/profile/${getOtherParticipant(selectedConversation)!.id}`}>
                          <p className="font-semibold hover:underline">{getOtherParticipant(selectedConversation)!.name}</p>
                        </Link>
                        </div>
                    </div>
                    {selectedConversation.rideId && (
                      <Link href={`/ride/${selectedConversation.rideId}`}>
                        <Button variant="outline" size="sm">
                            <Car className='h-4 w-4 mr-2 text-primary' />
                            <span>View Ride</span> 
                        </Button>
                       </Link>
                    )}
                </div>
                <ScrollArea className="flex-1 p-6 bg-secondary/20">
                  <div className="space-y-6" ref={scrollAreaRef}>
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex items-end gap-2',
                          message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.senderId !== currentUser.id && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={getOtherParticipant(selectedConversation)!.avatarUrl} data-ai-hint="portrait person"/>
                            <AvatarFallback>{getOtherParticipant(selectedConversation)!.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 shadow-md',
                            message.senderId === currentUser.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card'
                          )}
                        >
                          <p>{message.text}</p>
                           <p className={cn("text-xs mt-1 text-right", message.senderId === currentUser.id ? 'text-primary-foreground/70' : 'text-muted-foreground' )}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                  <form className="flex items-center space-x-2" onSubmit={handleSendMessage}>
                    <Input 
                        placeholder="Type your message..." 
                        className="flex-1"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon" className='bg-primary hover:bg-primary/90' disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                <MessageCircle className="h-16 w-16 text-primary/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">Select a conversation</h3>
                <p>Choose a conversation from the list to start chatting.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
