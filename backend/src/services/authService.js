import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import AppError from "../utils/appError.js";
import {signAccessToken,signRefreshToken, refreshTokenExpiry,hashToken} from "../utils/jwt.js";

const SALT_ROUNDS = 12;

export const registerService = async ({ name, email, password }) => {            
    const userExists = await prisma.user.findFirst({ where: {OR: [{ email }, { name }]},
        select: {email: true,name:  true,} 
    })    
    if (userExists){
        if(userExists.email == email)
            throw new AppError("Email is already in use", 409);
        if(userExists.name == name)
            throw new AppError("Username is already in use", 409);        
    } 

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
        data: { name, email, passwordHash },
        select: { id: true, name: true, email: true, createdAt: true }
    })

    return user;
}

export const loginService = async({name,password})=>{
    
    const user = await prisma.user.findFirst({ where: { name }})  
    if(!user) throw new AppError('User not found!',409);

    const valid = await bcrypt.compare(password, user.passwordHash);    
    if(!valid) throw new AppError('Password is incorrect!',409);
    
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    try {
        await prisma.refreshToken.create({
            data :{
                tokenHash:hashToken(refreshToken),
                userId:user.id,
                expiresAt:refreshTokenExpiry()
            }
        })

    } catch (error) {
        console.log(error);
        return error;        
    }

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return {
        user:{id:user.id,name:user.name,email:user.name},
        accessToken
    }
}
