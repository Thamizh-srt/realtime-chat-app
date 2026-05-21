import {createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import {createChannel} from '../thunks/createChannelThunk';

const initialState = {
    isOpen:false,
    isChannelModalOpen:false,
    channelToEdit:null,
    mode:'add',
    channel:"add"
};

const modalSlice = createSlice({
    name:'modal',
    initialState,
    reducers:{
        openModal:(state)=>{
            debugger
            state.isOpen = true;
            state.mode = 'add';
        },
        closeModal:(state)=>{
            state.isOpen = false;
        },
        editOpenModal:(state)=>{
            state.isOpen = true;
            state.mode = 'edit';
        },
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