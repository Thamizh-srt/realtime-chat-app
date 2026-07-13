import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

export const getMessages = async (roomId) => {
    try {
        const response = await axiosInstance.get(`/channel/${roomId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.error || error.message);
        throw error;
    }
};