import io from 'socket.io-client';

export const socket = io('https://apibills-production.up.railway.app', {
  withCredentials: true, // Essencial para funcionar com seus cookies
  transports: ['websocket', 'polling'],
  autoConnect: true,
});