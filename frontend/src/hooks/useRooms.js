import {useContext} from 'react';
import { RoomContext } from '../context/RoomContext';

export const useRooms = ()=>{
    const context = useContext(RoomContext);
    if(!context) throw new Error('useRooms must be used within RoomProvider');
    return context;
}