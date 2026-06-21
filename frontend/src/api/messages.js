import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

export const getMessages = async (roomId)=>{
    try {
        debugger
        const response = await axiosInstance.get(`/channel/${roomId}`); 
        return response.data;
    } catch (error) {
        // console.error('Error fetching room by ID:', error);
        toast.error(error.response?.data?.error || error.message);
        throw error;
    }
}