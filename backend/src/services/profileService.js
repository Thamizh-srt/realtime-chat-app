import prisma from "../config/db.js";
import AppError from "../utils/appError.js";

export const usersLists = async()=>{
    const res = await prisma.user.findMany({
        select:{id:true,name:true,email:true}
    });
    return res;
}
