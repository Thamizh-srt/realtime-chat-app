import prisma from '../config/db.js';
import AppError from '../utils/appError.js';

export const createService = async({name,id}, userId)=>{
    let channel;
    try {
        if(!id){
            channel = await prisma.room.create({
                data:{
                    name:name,
                    members:{create:{userId}}
                },
                include: { _count: { select: { members: true } } },
            })
        }else{
            channel = await prisma.room.update({
                where:{id},
                data:{name:name},
                select: { id: true, name: true, createdAt: true }
            })
        }
    } catch (error) {
        throw new AppError('Error creating/updating channel', 409);
    }

    return channel;
}

export const listService = async()=>{
    const channels = await prisma.room.findMany({
        select: { id: true, name: true, createdAt: true }
    })
    return channels;
}

export const deleteService = async(id)=>{
    try {
        const channel = await prisma.room.delete({
            where:{id}
        })
    } catch (error) {
        throw new AppError('Error while deleting!',409);
    }
    return channel;
}

export const getchannelById = async(roomId)=>{
    const room = await prisma.room.findUnique({
        where:{id:roomId},
        include:{
            members:{include:{user:{select:{id:true,name:true}}}},
            _count:{select:{messages:true}}
        }
    });

    if(!room) throw new AppError('Room not found',409);

    return room;
}