import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSocket } from "../hooks/useSocket";

export const UserContext = createContext();

export const UserProvider = ({children})=>{

    const [users, setUsers ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const socket = useSocket();

    useEffect(() => {
        setLoading(true);
        getUsers().then(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleUserOnline = ({ userId }) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, status: 'online' } : user
                )
            );
        };

        const handleUserOffline = ({ userId }) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, status: 'offline' } : user
                )
            );
        };

        socket.on('user_online', handleUserOnline);
        socket.on('user_offline', handleUserOffline);

        return () => {
            socket.off('user_online', handleUserOnline);
            socket.off('user_offline', handleUserOffline);
        };
    }, [socket]);

    const getUsers = async()=>{
        const response = await axiosInstance.get('/users/get');
        const loadedUsers = response.data.users.map((user) => ({
            ...user,
            status: user.status?.toLowerCase() === 'online' ? 'online' : 'offline',
        }));
        setUsers(loadedUsers);
    }

    return(
        <UserContext.Provider value={{users}}>
            {children}
        </UserContext.Provider>
    )
}