import {createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import {createChannel} from '../thunks/createChannelThunk';

const initialState = {
    isOpen:false,
    isChannelModalOpen:false,
    channelName:"",
    mode:'add',
    channel:"add",
    channelId:null,
};

const modalSlice = createSlice({
    name:'modal',
    initialState,
    reducers:{
        openModal:(state)=>{
            state.isOpen = true;
            state.mode = 'add';
        },
        closeModal:(state)=>{
            state.isOpen = false;
        },
        editOpenModal:(state,action)=>{
            state.isOpen = true;
            state.mode = 'edit';
            state.channelName = action.payload.name;
            state.channelId = action.payload.id;
        },
        setChannelName:(state,action)=>{
            state.channelName = action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(createChannel.pending,(state)=>{
            state.loading = true;
        })
        .addCase(createChannel.fulfilled,(state,action)=>{
            state.loading = false;
            state.channel = action.payload.channel;
            state.isOpen = false;
        })
        .addCase(createChannel.rejected,(state,action)=>{
            state.loading = false;
            state.isOpen = false;
        })
    } 
});

export const {openModal,closeModal,editOpenModal,submitModal} = modalSlice.actions;

export default modalSlice.reducer;