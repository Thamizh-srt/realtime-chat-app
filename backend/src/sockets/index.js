import { Server } from "socket.io";
import { socketAuth } from "../middlewares/authMiddleware.js";
import { saveMessage } from "../services/messageService.js";
import { addOnlineUser, removeOnlineUser } from "../services/presenceService.js";
import logger from "../utils/logger.js";

const normalizeRoomId = (roomId) => roomId?.trim();

export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.use(socketAuth);

    io.on('connection', (socket) => {
        const { user } = socket;
        const activeSockets = addOnlineUser(user.id);

        logger.info({ userId: user.id, name: user.name, activeSockets }, 'Socket connected');
        io.emit('user_online', { userId: user.id, name: user.name });

        socket.on('join_room', ({ roomId }) => {
            const normalizedRoomId = normalizeRoomId(roomId);
            if (!normalizedRoomId) return;

            socket.join(normalizedRoomId);
            socket.to(normalizedRoomId).emit('user_joined', {
                userId: user.id,
                name: user.name,
                roomId: normalizedRoomId,
                timestamp: new Date().toISOString(),
            });
            socket.emit('room_joined', { roomId: normalizedRoomId });

            logger.debug({ userId: user.id, roomId: normalizedRoomId }, 'User joined room');
        });

        socket.on('send_message', async ({ roomId, content }) => {
            const normalizedRoomId = normalizeRoomId(roomId);
            const messageContent = content?.trim();

            if (!normalizedRoomId || !messageContent) return;

            try {
                const message = await saveMessage(normalizedRoomId, messageContent, user.id);

                io.to(normalizedRoomId).emit('new_message', {
                    id: message.id,
                    content: message.content,
                    roomId: normalizedRoomId,
                    user: message.user,
                    createdAt: message.createdAt,
                    userId: message.userId,
                });
            } catch (err) {
                socket.emit('error', {
                    message: err.message || 'Failed to send message',
                });
                logger.error({ err, userId: user.id }, 'Message send error');
            }
        });

        socket.on('typing_start', ({ roomId }) => {
            const normalizedRoomId = normalizeRoomId(roomId);
            if (!normalizedRoomId) return;

            socket.to(normalizedRoomId).emit('user_typing', {
                userId: user.id,
                name: user.name,
                roomId: normalizedRoomId,
            });
        });

        socket.on('typing_stop', ({ roomId }) => {
            const normalizedRoomId = normalizeRoomId(roomId);
            if (!normalizedRoomId) return;

            socket.to(normalizedRoomId).emit('user_stopped_typing', {
                userId: user.id,
                roomId: normalizedRoomId,
            });
        });

        socket.on('leave_room', ({ roomId }) => {
            const normalizedRoomId = normalizeRoomId(roomId);
            if (!normalizedRoomId) return;

            socket.leave(normalizedRoomId);
            socket.to(normalizedRoomId).emit('user_left', {
                userId: user.id,
                name: user.name,
                roomId: normalizedRoomId,
            });
        });

        socket.on('disconnect', (reason) => {
            const remaining = removeOnlineUser(user.id);
            logger.info({ userId: user.id, reason, remaining }, 'Socket disconnected');
            if (remaining === 0) {
                io.emit('user_offline', { userId: user.id, name: user.name });
            }
        });
    });

    return io;
};