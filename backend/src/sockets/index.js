import { Server } from "socket.io";
import { socketAuth } from "../middlewares/authMiddleware.js";
import {saveMessage} from "../services/messageService.js";
import logger  from "../utils/logger.js";

export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // ─── Socket auth middleware ──────────────────────────────────
    // Every socket connection must send a valid JWT
    // Client: const socket = io(URL, { auth: { token: accessToken } })
    io.use(socketAuth);

  // ─── Connection handler ──────────────────────────────────────
    io.on('connection', (socket) => {
        logger.info({ userId: socket.user.id, name: socket.user.name }, 'Socket connected');

    // ── join_room ─────────────────────────────────────────────
    // Client emits: socket.emit('join_room', { roomId })
    socket.on('join_room', ({ roomId }) => {
        socket.join(roomId);
        socket.to(roomId).emit('user_joined', {
            userId: socket.user.id,
            name: socket.user.name,
            roomId,
            timestamp: new Date().toISOString(),
        });
        logger.debug({ userId: socket.user.id, roomId }, 'User joined room');
    });

    // ── send_message ──────────────────────────────────────────
    // Client emits: socket.emit('send_message', { roomId, content })
    socket.on('send_message', async ({ roomId, content }) => {
        try {
            if (!content?.trim() || !roomId) return;

            const message = await saveMessage({
                content: content.trim(),
                userId: socket.user.id,
                roomId,
            });

            // Broadcast to everyone in the room (including sender)
            io.to(roomId).emit('new_message', {
                id: message.id,
                content: message.content,
                roomId,
                user: message.user,
                createdAt: message.createdAt,
            });
        } catch (err) {
            // Send error only to the sender
            socket.emit('error', { message: err.message });
            logger.error({ err, userId: socket.user.id }, 'Message send error');
        }
    });

    // ── typing indicators ─────────────────────────────────────
    socket.on('typing_start', ({ roomId }) => {
        socket.to(roomId).emit('user_typing', {
            userId: socket.user.id,
            name: socket.user.name,
        });
    });

    socket.on('typing_stop', ({ roomId }) => {
        socket.to(roomId).emit('user_stopped_typing', {
            userId: socket.user.id,
        });
    });

    // ── leave_room ────────────────────────────────────────────
    socket.on('leave_room', ({ roomId }) => {
        socket.leave(roomId);
        socket.to(roomId).emit('user_left', {
            userId: socket.user.id,
            name: socket.user.name,
            roomId,
        });
    });

    // ── disconnect ────────────────────────────────────────────
    socket.on('disconnect', () => {
      logger.info({ userId: socket.user.id }, 'Socket disconnected');
    });
  });

  return io;
};