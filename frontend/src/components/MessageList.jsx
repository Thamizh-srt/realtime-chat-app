import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import {useRooms} from '../hooks/useRooms';

export default function MessageList({ currentUser, isOtherTyping }) {
  const bottomRef = useRef(null);
  const { activeRoom, user } = useRooms();
  // Smooth scroll to bottom when new messages arrive or typing status changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeRoom?.messages, isOtherTyping]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-muted/30 dark:bg-background/50 p-4 sm:p-6 custom-scrollbar transition-colors duration-300">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        {activeRoom?.messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="text-xl font-medium text-foreground">No messages yet</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Send a message to start the conversation! Your messages will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="my-6 text-center">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground border border-border">
                Today
              </span>
            </div>
            {activeRoom?.messages.map((message, index) => {
              const isOwnMessage = message.userId === user?.id;
              // Check if previous message is from same sender to group them
              const prevMessage = index > 0 ? activeRoom.messages[index - 1] : null;
              const isGrouped = prevMessage && prevMessage.sender === message.sender;
              
              // Only show avatar if it's the last message in a group (for simplicity, we'll just show it for all for now, but could be optimized)
              const showAvatar = !isGrouped || true; // Set to true to always show for now

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        )}
        
        {isOtherTyping && <TypingIndicator />}
        
        {/* Invisible element to scroll to */}
        <div ref={bottomRef} className="h-px w-full mt-2" />
      </div>
    </div>
  );
}
