import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import ChannelModal from './components/ChannelModal';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from './hooks/useAuth';
import { useRooms } from './hooks/useRooms';
import ProtectedRoute from './components/ProtectedRoute';
import EmptyTab from "./components/EmptyTab";
import socket from './sockets/socket';

function App() {
  const { user, logout, loading } = useAuth();
  const username = user?.name ?? user?.email ?? 'User';
  const [currentRoom, setCurrentRoom] = useState('general');
//   const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const {activeRoom} = useRooms();
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme class to document body
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    socket.on('connect',()=>{
        console.log('connected:',socket.id);
    })
    socket.on("connect_error", (err) => {
        console.log("Connection Error:", err.message);
    });
    return()=>{
        socket.off('connect');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };


  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: username,
      timestamp: Date.now(),
      avatar: `https://i.pravatar.cc/150?u=${username}` // Generate consistent avatar based on name
    };

    setMessages(prev => ({
      ...prev,
      [currentRoom]: [...(prev[currentRoom] || []), newMessage]
    }));

    // Simulate "bot" response to typing
    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      setTimeout(() => {
        setOtherTyping(true);
        setTimeout(() => {
          setOtherTyping(false);
          const replyMsg = {
            id: Date.now().toString() + 'reply',
            text: `Hello ${username}! How are you doing today?`,
            sender: 'System Bot',
            timestamp: Date.now(),
            avatar: 'https://i.pravatar.cc/150?u=system'
          };
          setMessages(prev => ({
            ...prev,
            [currentRoom]: [...(prev[currentRoom] || []), replyMsg]
          }));
        }, 1500);
      }, 500);
    }
  };

  const handleTyping = (isUserTyping) => {
    setIsTyping(isUserTyping);
    // In a real app, this would emit a socket event
  };

//   const currentMessages = messages[currentRoom] || [];

  return (
    <>
        <ToastContainer position="top-right" autoClose={3000} theme={theme} />
        <ProtectedRoute>
            <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
                {/* Sidebar - hidden on mobile, toggled via hamburger in a real app */}
                <div className="hidden md:flex h-full">
                    <Sidebar
                        username={username}
                        currentRoom={currentRoom}
                        onRoomChange={setCurrentRoom}
                        onLogout={logout}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />
                </div>

                {/* Main Chat Area */}
                <div className={`flex-1 h-full overflow-hidden relative ${activeRoom ? 'flex flex-col' : ''}`}>
                    {
                        activeRoom ? (
                            <div className="flex h-full flex-col">
                                <ChatHeader currentRoom={currentRoom} />
                                
                                <MessageList 
                                    currentUser={username} 
                                    isOtherTyping={otherTyping}
                                />
                                
                                <MessageInput 
                                    onSendMessage={handleSendMessage} 
                                    onTyping={handleTyping}
                                />
                            </div>
                        ) : (
                            <EmptyTab />
                        )
                    }
                </div>
            </div>
            <ChannelModal />
        </ProtectedRoute>
    </>
  );
}

export default App;
