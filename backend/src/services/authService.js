import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import AppError from "../utils/appError.js";

const SALT_ROUNDS = 12;

export const registerService = async ({ name, email, password }) => {        
    const userExists = await prisma.user.findUnique({ where: { email } })

    if (userExists) throw new AppError("Email is already in use", 409);

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
        data: { name, email, password:passwordHash },
        select: { id: true, name: true, email: true, createdAt: true }
    })

    return user;
}
