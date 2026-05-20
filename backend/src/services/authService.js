import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import AppError from "../utils/appError.js";
import {signAccessToken,signRefreshToken, refreshTokenExpiry, hashToken, verifyRefreshToken} from "../utils/jwt.js";

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
    return {
        user:{id:user.id,name:user.name,email:user.email},
        accessToken,refreshToken
    }
}

export const refreshService = async(oldRefreshToken=null)=>{           
    if(!oldRefreshToken) throw new AppError('Refresh token is required!',401);
    
    const payload = verifyRefreshToken(oldRefreshToken);        
    if(!payload) throw new AppError('Invalid refresh token!',401); 
    
    const hashedOldToken = hashToken(oldRefreshToken);
    const storedToken = await prisma.refreshToken.findFirst({ where: { tokenHash: hashedOldToken } });
    
    if(!storedToken || storedToken.expiresAt < new Date()) throw new AppError('Refresh token is invalid or expired!',401);
    
    await prisma.refreshToken.delete({ where: { tokenHash: hashedOldToken } });
    const accessToken = signAccessToken(payload.sub);
    const refreshToken = signRefreshToken(payload.sub); 

    await prisma.refreshToken.create({
        data: {
            tokenHash: hashToken(refreshToken),
            userId: payload.sub,
            expiresAt: refreshTokenExpiry()
        }
    });

    const user = await prisma.user.findUnique({where:{id:payload.sub},select:{id:true,name:true,email:true}});
    
    return  {user:{id:user.id,name:user.name,email:user.email},accessToken,refreshToken};
}


