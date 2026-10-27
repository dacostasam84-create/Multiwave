import { io } from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_SOCKET_URL || window.location.origin;

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