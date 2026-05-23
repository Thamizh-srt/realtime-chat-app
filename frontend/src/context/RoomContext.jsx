import {useContext, createContext, useState, useEffect, useCallback} from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { closeModal } from '../slices/modalSlice';
import { useDispatch } from 'react-redux';

export const RoomContext = createContext();

export const RoomProvider = ({children})=>{
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [loading,setLoading] = useState(false);
    const { user, isInitialized } = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        // Only fetch rooms when auth is initialized and user is authenticated
        if (isInitialized && user) {
            setLoading(true);
            fetchRooms().then(() => setLoading(false));
        }
    }, [isInitialized, user]);

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/channel/list');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteChannel = async(id)=>{
        try {                   
            const response = await axiosInstance.post('/channel/delete',{id});
            const room = rooms.filter((room) => room.id !== id);
            setRooms(room);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const joinRoom = async(roomId)=>{
        try {
            const response = await axiosInstance.post('/channel/join',{roomId});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const leaveRoom = async(roomId)=>{
        try {
            const response = await axiosInstance.post('/channel/leave',{roomId});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const createRoom = async(roomData)=>{
        try {
            const response = await axiosInstance.post('/channel/create',roomData);
            const newRoom = response.data.channel;
            setRooms((prevRooms) => [...prevRooms, newRoom]);
            dispatch(closeModal());
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    return (
        <RoomContext.Provider value={{ rooms, activeRoom, fetchRooms, joinRoom, leaveRoom, createRoom, setActiveRoom, deleteChannel }}>
            {children}
        </RoomContext.Provider>
    )
}