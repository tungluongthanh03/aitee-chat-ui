// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

// Create a Context to share the socket instance
const SocketContext = createContext(null);

// Provide socket to the rest of the app
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let socketInstance = null;
    // Initialize the socket connection once
    if (!socket) {
      socketInstance = io("http://localhost:3000"); // Adjust URL if needed
      setSocket(socketInstance);
    }

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to access the socket context
export const useSocket = () => useContext(SocketContext);
