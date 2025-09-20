// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import ioClient from "socket.io-client";

type SocketType = ReturnType<typeof ioClient>;

interface SocketContextType {
  socket: SocketType | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<SocketType | null>(null);

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:4000"; 
    const newSocket = ioClient(url);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
