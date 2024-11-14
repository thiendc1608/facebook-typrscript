// SocketContext.js
import { createContext, useState, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";

type SocketProviderProps = {
  children: React.ReactNode;
};

// URL của server WebSocket
const SOCKET_URL = "http://localhost:5000";

// Tạo context
export const SocketContext = createContext<Socket>({} as Socket);

// Socket Provider: Cung cấp kết nối WebSocket cho ứng dụng
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    // Tạo kết nối WebSocket khi component được mount
    const socketIo = io(SOCKET_URL);
    setSocket(socketIo);

    // Cleanup khi component unmount
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const socketValue = useMemo(() => socket ?? io(SOCKET_URL), [socket]);

  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  );
};
