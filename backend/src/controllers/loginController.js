import { catchAsync } from "../utils/appError.js";
import {registerService, loginService, refreshService} from "../services/authService.js";

export const registerUser = catchAsync(async (req, res) => {
    const data = await registerService(req.body);
    res.status(201).json(data);
})

export const loginUser = catchAsync(async (req, res) => {     
    const user = await loginService(req.body);
    res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(201).json(user);
})

export const authRefresh = catchAsync(async (req, res) => {          
    let oldRefreshToken = req.cookies.refreshToken;          
    const user = await refreshService(oldRefreshToken);
    res.cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(201).json(user);
})

