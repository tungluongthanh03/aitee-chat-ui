import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "./SocketContext";

function MessageInput() {
  const [message, setMessage] = useState("");

  const chatUser = useSelector((state) => state.chatUser);
  const currentUser = useSelector((state) => state.user);

  const socket = useSocket();

  const handleSendMessage = () => {
    socket.emit("sendMessage", {
      sendFrom: currentUser.id,
      sendTo: chatUser.id,
      content: message,
    });
    const newConversation = {
      id: chatUser.id,
      username: chatUser.username,
      avatar: chatUser.avatar,
      latestMessage: message,
    }
    console.log(message);

    setMessage("");
  };

  function changeMessage(e) {
    const { value } = e.target;
    setMessage(value);
  }

  return (
    <>
      <input
        type="text"
        placeholder="Message..."
        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-3"
        value={message}
        onChange={(e) => changeMessage(e)}
      />
      <button
        className="ml-3 text-gray-400 hover:text-white"
        onClick={handleSendMessage}
      >
        ➤
      </button>
    </>
  );
}

export default MessageInput;
