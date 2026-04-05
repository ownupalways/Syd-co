import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '@config';
import { logger } from '@utils/logger';

let io: SocketServer;

export const initSocket = (server: HttpServer): SocketServer => {
 io = new SocketServer(server, {
   cors: {
     origin: ['http://localhost:5173', 'http://localhost:5174'],
     methods: ['GET', 'POST'],
     credentials: true,
   },
 });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) { next(new Error('Authentication required')); return; }
    try {
      const decoded = jwt.verify(token, config.jwt.secret as string) as { id: string; role: string };
      socket.data.adminId = decoded.id;
      socket.data.role = decoded.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Admin connected: ${socket.data.adminId}`);

    // Join role-based room
    socket.join(socket.data.role);
    socket.join(`admin:${socket.data.adminId}`);

    socket.on('disconnect', () => {
      logger.info(`Admin disconnected: ${socket.data.adminId}`);
    });
  });

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};

// Emit to all super-admins
export const notifySuperAdmins = (event: string, data: unknown): void => {
  if (!io) return;
  io.to('super-admin').emit(event, data);
};

// Emit to specific admin
export const notifyAdmin = (adminId: string, event: string, data: unknown): void => {
  if (!io) return;
  io.to(`admin:${adminId}`).emit(event, data);
};
