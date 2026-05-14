import { verifyAccessToken } from "../utils/jwt.js";
import AppError from "../utils/appError.js";
import prisma from "../config/db.js";
import { email } from "zod";

const protect = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return next(new AppError('No token provided', 401));
        }

        const token = authHeader.split('')[1];
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