import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import ChannelModal from './components/ChannelModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './hooks/useAuth';
import { useRooms } from './hooks/useRooms';
import ProtectedRoute from './components/ProtectedRoute';
import EmptyTab from './components/EmptyTab';

function App() {
  const { user, logout } = useAuth();
  const username = user?.name ?? user?.email ?? 'User';
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isTyping, setIsTyping] = useState(false);
  const { activeRoom } = useRooms();

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };


  const handleTyping = (isUserTyping) => {
    setIsTyping(isUserTyping);
  };

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
                                
                                <MessageList />
                                
                                <MessageInput onTyping={handleTyping} />
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
