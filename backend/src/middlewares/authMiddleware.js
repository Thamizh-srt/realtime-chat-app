import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import AppError from "../utils/appError.js";
import prisma from "../config/db.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return next(new AppError('No token provided', 401));
        }

        const token = authHeader.split(' ')[1];        
        const payload = verifyAccessToken(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, name: true, email: true }
        })
        if (!user) return next(new AppError('User no longer exists', 401));        
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

export const socketAuth = async (socket, next) => {
    try {
        const cookies = cookie.parse(
            socket.handshake.headers.cookie || ""
        );
        
        const token = cookies.refreshToken;
        if (!token) return next(new Error('No token'));
        console.log(token);
        
        const payload = verifyRefreshToken(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, name: true },
        });

        if (!user) return next(new Error('User not found'));

        socket.user = user;  // Attach user to socket instance
        next();
    } catch {
        next(new Error('Authentication failed'));
    }
};