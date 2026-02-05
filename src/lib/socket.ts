import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      withCredentials: true,
      autoConnect: true,
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ["websocket", "polling"], // Fallback to polling if websocket fails
    });

    socket.connect();
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌❌ Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};
