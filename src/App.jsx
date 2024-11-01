import React, { useEffect, useState } from 'react';
import ChatWindow from './layout/ChatWindow';
import Sidebar from './layout/Sidebar';
import io from "socket.io-client";

const App = () => {
  const socket = io("http://localhost:3000");
  const currentUserId = "00001";
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);  // Set the selected user to show their chat
  };


  useEffect(() => {
    socket.emit("userConnected", currentUserId);
    console.log("User connected: ", currentUserId);
    socket.emit("sendMessage", currentUserId);
  }, )

  return (
    <div className="flex h-screen">
      <Sidebar onUserSelect={handleUserSelect} />
      <div className="flex-1">
        {selectedUserId ? (
          <ChatWindow socket={socket} currentUserId={currentUserId} conversationUserId={selectedUserId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
