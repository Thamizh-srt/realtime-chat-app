import {useQuery} from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export function useChannels(){
    return useQuery({
        queryKey: ['channels'],
        queryFn: async()=>{
            const response = await axiosInstance.get('/channel/list');
            return response.data;
        },
        staleTime: Infinity,
    });     

};