import prisma from '../config/db.js';

export const createService = async({name})=>{
    const channel = await prisma.room.create({
        data:{name:name},
        select: { id: true, name: true, createdAt: true }
    })
    return channel;
}

export const listService = async()=>{
    const channels = await prisma.room.findMany({
        select: { id: true, name: true, createdAt: true }
    })
    return channels;
}