import { catchAsync } from "../utils/appError.js";
import{createService, listService, deleteService, getchannelById} from "../services/channelService.js";

export const createChannel = catchAsync(async (req, res) => {
    const channel = await createService(req.body, req.user.id);
    res.status(201).json({message:'Channel created successfully!', channel});
});

export const getChannel = catchAsync(async(req,res)=>{    
    const channels = await listService();
    res.status(200).json(channels);
});

export const deleteChannel = catchAsync(async(req,res)=>{
    const {id} = req.body;
    const channel = await deleteService(id);
    res.status(200).json({message:'Channel deleted successfully!', channel});
});

export const getSingleChannel = catchAsync(async(req, res)=>{
    const channel = await getchannelById(req.body.roomId);
    res.status(201).json({channel});
});

export const leaveChannel = catchAsync(async(req,res)=>{
    const {roomId} = req.body;
    const channel = await deleteService(roomId);
    res.status(200).json({message:'Left channel successfully!', channel});
});