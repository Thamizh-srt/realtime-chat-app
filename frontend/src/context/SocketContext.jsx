import { createContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext(undefined);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { accessToken } = useAuth();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!accessToken || !url) return;

        const newSocket = io(url, {
            auth: { token: accessToken },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            withCredentials: true,
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [accessToken, url]);

    const value = useMemo(() => socket, [socket]);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};