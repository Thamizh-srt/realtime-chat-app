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
        return channel;
    } catch (error) {
        throw new AppError('Error while deleting!',409);
    }
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

export const leaveChannelService = async(roomId, userId)=>{
    try {
        const channel = await prisma.roomMember.delete({
            where: {
                roomId_userId: {
                    roomId,
                    userId
                }
            }
        });
        return channel;
    } catch (error) {
        throw new AppError('Error while leaving channel!', 409);
    }
}

export const joinChannelService = async(roomId, userId)=>{
    const room = await prisma.room.findUnique({where:{id:roomId}});
    if(!room) throw new AppError('Room not found', 404);
    try {
        const channel = await prisma.roomMember.upsert({
            where: { roomId_userId: {roomId, userId} },
            update:{},  
            create:{roomId, userId}
        });
        return channel;
    } catch (error) {
        console.log(error);
        
        throw new AppError('Error while joining channel!', 409);
    }   
}
