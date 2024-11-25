// SocketContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Định nghĩa kiểu dữ liệu cho context
interface SocketContextType {
  socket: Socket | null; // Kiểu 'Socket' từ 'socket.io-client'
}

export const SocketContext = createContext<SocketContextType>({ socket: null });

const SOCKET_SERVER_URL = "http://localhost:8000"; // Địa chỉ server Socket của bạn

// Tạo SocketProvider để cung cấp socket cho các component con
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Tạo kết nối Socket khi component mount
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Cleanup khi component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
