import {createContext, useState} from 'react';
import { useRooms } from '../hooks/useRooms';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axiosInstance';

export const MessageContext = createContext(null);

export const MessageProvider = ({children})=>{
    const { activeRoom, setActiveRoom } = useRooms();
    const { user } = useAuth();
    const {messages, setMessage } = useState([]);

    const sendMessage = async(content)=>{
        const response = await axiosInstance.post(`/messages/post/${activeRoom.id}`, { content, sender: user.id });
        setActiveRoom(prev=>({
            ...prev,
            messages:[...prev.messages, response.data.message]
        }));
        // return response.data;
    };
    return (  
        <MessageContext.Provider value={{ messages, sendMessage }}>
            {children}
        </MessageContext.Provider>
    );
};