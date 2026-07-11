import { io } from 'socket.io-client';

const BACKEND_URL = 'http://127.0.0.1:3000';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};