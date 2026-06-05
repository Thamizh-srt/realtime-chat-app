import { catchAsync } from "../utils/appError.js";
import {usersLists} from "../services/profileService.js";

export const getProfile = catchAsync(async(req,res)=>{
    const users = await usersLists();
    res.status(201).json({users});
})