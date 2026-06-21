import {useContext} from "react";
import { SocketContext } from "../context/SocketContext";


export const useSocket = ()=>{
    const socket = useContext(SocketContext);
    if(!socket) throw Error('useSocket must be used within SocketProvider');
    return socket;
}