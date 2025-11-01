import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:4000';

function useWebSocket(token) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }

    const socketIo = io(SOCKET_SERVER_URL, {
      auth: { token },
      transports: ['websocket']
    });

    setSocket(socketIo);

    socketIo.on('connect_error', (err) => {
      // eslint-disable-next-line no-console
      console.error('WebSocket connection error:', err.message);
    });

    return () => {
      if (socketIo) socketIo.disconnect();
      setSocket(null);
    };
  }, [token]);

  return socket;
}

export default useWebSocket;
