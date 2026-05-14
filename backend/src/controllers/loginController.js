import { catchAsync } from "../utils/appError.js";
import {registerService} from "../services/authService.js";

export const registerUser = catchAsync(async (req, res) => {
    console.log(req.body);
    
    const user = await registerService(req.body);
    res.status(201).json({ user });
})

