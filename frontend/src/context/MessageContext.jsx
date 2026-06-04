import {createContext} from 'react';
import { useRooms } from '../hooks/useRooms';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axiosInstance';

export const MessageContext = createContext(null);

export const MessageProvider = ({children})=>{
    const { activeRoom, setActiveRoom } = useRooms();
    const { user } = useAuth();

    const sendMessage = async(content)=>{
        debugger;
        const response = await axiosInstance.post(`/messages/post/${activeRoom.id}`, { content, sender: user.id });
        return response.data;
    };
    return (  
        <MessageContext.Provider value={{ sendMessage }}>
            {children}
        </MessageContext.Provider>
    );
};