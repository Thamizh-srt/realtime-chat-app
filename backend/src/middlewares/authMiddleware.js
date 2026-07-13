import { verifyAccessToken, verifyRefreshToken, hashToken } from "../utils/jwt.js";
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
        });

        if (!user) return next(new AppError('User no longer exists', 401));
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};


export const socketAuth = async (socket, next) => {
    try {
        const authHeader = socket.handshake.headers.authorization;
        const authToken =
            socket.handshake.auth?.token ||
            (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

        let payload;

        if (authToken) {
            payload = verifyAccessToken(authToken);
        } else {
            const cookies = cookie.parse(socket.handshake.headers.cookie || '' );
            const refreshToken = cookies.refreshToken;

            if (!refreshToken) {
                return next(new Error('Authentication token missing'));
            }

            const refreshPayload = verifyRefreshToken(refreshToken);
            const hashedRefreshToken = hashToken(refreshToken);
            const storedToken = await prisma.refreshToken.findFirst({
                where: { tokenHash: hashedRefreshToken },
                select: { expiresAt: true }
            });

            if (!storedToken || storedToken.expiresAt < new Date()) {
                return next(new Error('Refresh token invalid or expired'));
            }

            payload = refreshPayload;
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, name: true, email: true },
        });

        if (!user) {
            return next(new Error('User not found'));
        }

        socket.user = user;
        next();
    } catch (error) {
        next(new Error('Authentication failed'));
    }
};