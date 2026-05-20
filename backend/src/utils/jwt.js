import jwt from "jsonwebtoken";
import crypto from "crypto";
import AppError from "./appError.js";

export const signAccessToken = (userId) => {        
   return jwt.sign({ sub: userId }, process.env.SECRECT_TOKEN, { expiresIn: process.env.EXPIRY_TIME || '15m' });
}

export const verifyAccessToken = (token) => {
    try {
        jwt.verify(token, process.env.SECRECT_TOKEN);
    } catch (error) {
        throw new AppError('Invalid or expired access token', 401);
    }
}

export const signRefreshToken = (userId) => {
    return jwt.sign({ sub: userId }, process.env.REFRESH_TOKEN, { expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN || '7d' });
}

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN);
    } catch (error) {
        throw new AppError('Invalid or expired refresh token', 401);
    }
}

export const hashToken = (token) =>  crypto.createHash('sha256').update(token).digest('hex');


export const refreshTokenExpiry = () => {
    const days = parseInt(process.env.REFRESH_TOKEN_EXPIRESIN || '7d');

    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}