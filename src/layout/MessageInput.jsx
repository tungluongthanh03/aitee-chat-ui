import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "./SocketContext";
import { addNewConversation, addNewMessage } from "../redux/apiRequests";

function MessageInput() {
  const [message, setMessage] = useState("");

  const chatUser = useSelector((state) => state.chatUser);
  const groupChat = useSelector((state) => state.groupChat);
  const currentUser = useSelector((state) => state.user);

  const socket = useSocket();
  const dispatch = useDispatch();

  const handleSendMessage = () => {
    const newMessage = {
      sendFrom: currentUser.id,
      sendToUser: chatUser?.id ,
      sendToGroupChat: groupChat.id,
      content: message,
    }

    socket.emit("sendMessage", newMessage);
    addNewMessage(dispatch, newMessage);

    const newConversation = groupChat.id === null ? {
      targetType: "user",
      targetId: chatUser.id,
      targetName: chatUser.username,
      targetAvatar: chatUser.avatar,
      lastMessage: message,
    } : {
      targetType: "groupChat",
      targetId: groupChat.id,
      targetName: groupChat.name,
      targetAvatar: groupChat.avatar,
      lastMessage: message,
    }
    addNewConversation(dispatch, newConversation)

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
