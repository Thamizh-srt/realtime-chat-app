import {saveMessage} from '../services/messageService.js';
import { catchAsync } from '../utils/appError.js';

export const sendMessage = catchAsync(async(req,res)=>{
    const {roomId} = req.params;
    const {content} = req.body;
    const userId = req.user.id;           
    const message = await saveMessage(roomId, content, userId);
    res.status(201).json({message:'Message sent successfully!', message});
});