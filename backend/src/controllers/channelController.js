import { catchAsync } from "../utils/appError.js";
import{createService, listService} from "../services/channelService.js";

export const createChannel = catchAsync(async (req, res) => {
    const channel = await createService(req.body);
    res.status(201).json({message:'Channel created successfully!', channel});
});

export const getChannel = catchAsync(async(req,res)=>{
    const channels = await listService();
    res.status(200).json(channels);
});