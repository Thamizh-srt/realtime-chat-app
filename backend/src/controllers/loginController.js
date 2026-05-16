import { catchAsync } from "../utils/appError.js";
import {registerService, loginService} from "../services/authService.js";

export const registerUser = catchAsync(async (req, res) => {
    const data = await registerService(req.body);
    res.status(201).json(data);
})

export const loginUser = catchAsync(async (req, res) => {        
    const user = await loginService(req.body);
    res.status(201).json({ user });
})

