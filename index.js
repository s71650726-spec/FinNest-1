import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function initWebSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // In production, limit origins
      methods: ['GET', 'POST']
    },
    maxHttpBufferSize: 1e6
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: payload.sub, roles: payload.roles };
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    // eslint-disable-next-line no-console
    console.log(`WebSocket connected: userId=${socket.user.id}`);

    // Join room for user-specific events
    socket.join(socket.user.id);

    // Event handlers for real-time updates can be added here

    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log(`WebSocket disconnected: userId=${socket.user.id}`);
    });
  });

  // Export io for use in other modules if needed
  return io;
}
