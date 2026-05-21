import axiosInstance from "../api/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { queryClient} from '../api/queryClient';

export const createChannel = createAsyncThunk(
    'modal/createChannel',  
    async(channelName)=>{
        try {                   
            const response = await axiosInstance.post('/channel/create',{name:channelName});
            queryClient.invalidateQueries({ queryKey: ['channels'] });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

)