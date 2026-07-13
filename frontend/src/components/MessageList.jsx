import { useCallback, useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useRooms } from '../hooks/useRooms';
import { useSocket } from '../hooks/useSocket';
import { getMessages } from '../api/messages';

export default function MessageList() {
  const bottomRef = useRef(null);
  const { activeRoom, user } = useRooms();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [otherTyping, setOtherTyping] = useState(false);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!activeRoom) {
      setMessages([]);
      return;
    }

    let isCancelled = false;

    const loadMessages = async () => {
      try {
        const response = await getMessages(activeRoom.id);
        debugger
        if (!isCancelled) {
          setMessages(response.channel?.messages || []);
        }
      } catch (error) {
        if (!isCancelled) {
          setMessages([]);
        }
      }
    };

    loadMessages();

    socket.emit('join_room', { roomId: activeRoom.id });

    return () => {
      isCancelled = true;
      socket.emit('leave_room', { roomId: activeRoom.id });
    };
  }, [activeRoom, socket]);

  useEffect(() => {
    if (!socket || !activeRoom) return;

    const handleNewMessage = (message) => {
      if (message.roomId !== activeRoom.id) return;
      setMessages((prev) => {
        if (prev.some((item) => item.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    const handleUserTyping = ({ roomId }) => {
      if (roomId === activeRoom.id) {
        setOtherTyping(true);
      }
    };

    const handleUserStoppedTyping = ({ roomId }) => {
      if (roomId === activeRoom.id) {
        setOtherTyping(false);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
    };
  }, [socket, activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherTyping, scrollToBottom]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-muted/30 dark:bg-background/50 p-4 sm:p-6 custom-scrollbar transition-colors duration-300">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        {messages.length === 0 ? (
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
            {messages.map((message, index) => {
              const isOwnMessage = message.userId === user?.id || message.user?.id === user?.id;
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const isGrouped = prevMessage && prevMessage.userId === message.userId;
              const showAvatar = !isGrouped;

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

        {otherTyping && <TypingIndicator />}
        <div ref={bottomRef} className="h-px w-full mt-2" />
      </div>
    </div>
  );
}
