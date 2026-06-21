import { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Send, Mic } from 'lucide-react';
import { cn } from '../lib/utils';
import {useMessage} from '../hooks/useMessage';
import { useSocket } from '../hooks/useSocket';
import { useRooms } from '../hooks/useRooms';

export default function MessageInput({ onSendMessage, onTyping }) {
    const [text, setText] = useState('');
    const inputRef = useRef(null);
    const { sendMessage } = useMessage();
    const socket = useSocket();
    const activeRoom = useRooms();
    const [typing, setTyping] = useState([]);

  // Handle typing indicator logic
  useEffect(() => {
    if (text.length > 0) {
      onTyping(true);
      const timeout = setTimeout(() => onTyping(false), 2000);
      return () => clearTimeout(timeout);
    } else {
      onTyping(false);
    }
    socket.on('user_typing', ({ userId, name }) => {
      setTyping(prev => [...new Set([...prev, name])])
    })
  }, [text, onTyping]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
        sendMessage(text.trim());
        setText('');
        onTyping(false);
        // Keep focus on input after sending
        if (inputRef.current) {
            inputRef.current.focus();
        }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }else{
            socket.emit('typing_start',{roomId:activeRoom.id})
        }
    };

  return (
    <div className="border-t border-border bg-background p-4 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-5xl items-end gap-2 sm:gap-4"
      >
        <button
          type="button"
          className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          title="Attach file"
        >
          <Paperclip className="h-5 w-5 transition-transform group-hover:scale-110" />
        </button>

        <div className="relative flex min-h-[44px] w-full items-end rounded-2xl border border-border bg-white dark:bg-muted shadow-sm transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="max-h-32 min-h-[44px] w-full resize-none bg-transparent py-3 pl-4 pr-12 text-[15px] text-foreground placeholder-muted-foreground focus:outline-none custom-scrollbar"
            rows={1}
            // style={{
            //   height: '44px',
            //   // Auto-grow logic would go here if needed
            // }}
          />
          <button
            type="button"
            className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
            title="Emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>

        {text.trim() ? (
          <button
            type="submit"
            className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:scale-105 active:scale-95"
            title="Send"
          >
            <Send className="h-5 w-5 ml-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        ) : (
          <button
            type="button"
            className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-all hover:bg-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary"
            title="Voice message"
          >
            <Mic className="h-5 w-5 transition-transform group-hover:scale-110" />
          </button>
        )}
      </form>
    </div>
  );
}
