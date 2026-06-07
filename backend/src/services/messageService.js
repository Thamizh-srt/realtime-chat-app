import prisma from '../config/db.js';
import AppError from '../utils/appError.js';

export const sendMessageToRoom = async (roomId, content, userId) => {
  const message = await prisma.message.create({
    data: {
      content,
      userId,
      roomId
    },
    include:{user:{select:{id:true,name:true}}}
  });
  return message;
};
