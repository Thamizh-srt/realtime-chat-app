import { createContext, useEffect, useState} from "react";
import axiosInstance from "../api/axiosInstance";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

export const SocketContext = createContext(null);

export const SocketProvider = ({children})=>{
    const [socket, setSocket] = useState(null);
    const url = import.meta.env.VITE_API_URL;
    const {accessToken} = useAuth();

    useEffect(()=>{
        if(!accessToken) return ;

        const newSocket = io(url,{
            auth:{token:accessToken},
            transports:['websocket'],
            reconnection:true,
            reconnectionDelay:1000,
        })

        setSocket(newSocket);

        return()=> newSocket.disconnect();
    },[accessToken]);

    return(
        <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
    )
}