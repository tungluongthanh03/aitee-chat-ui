import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../SocketContext";
import { addNewConversation, addNewMessage } from "../../../redux/apiRequests";

function MessageInput() {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const chatUser = useSelector((state) => state.chatUser);
  const groupChat = useSelector((state) => state.groupChat);
  const currentUser = useSelector((state) => state.user);

  const socket = useSocket();
  const dispatch = useDispatch();

  const reset = () => {
    setMessage("");
    setFiles([]);
  }

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files to existing state
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove file by index
  };

  const handleSendMessage = () => {
    const createdAt = new Date();

    const newMessage = {
      sendFrom: currentUser.id,
      sendToUser: chatUser?.id,
      sendToGroupChat: groupChat.id,
      content: message,
      media: files,
      createdAt,
    };

    socket.emit("sendMessage", newMessage);
    addNewMessage(dispatch, newMessage);

    setFiles([]);

    const newConversation =
      groupChat.id === null
        ? {
            targetType: "user",
            targetId: chatUser.id,
            targetName: chatUser.username,
            targetAvatar: chatUser.avatar,
            lastMessage: message,
            createdAt,
          }
        : {
            targetType: "groupChat",
            targetId: groupChat.id,
            targetName: groupChat.name,
            targetAvatar: groupChat.avatar,
            lastMessage: message,
            createdAt,
          };
    addNewConversation(dispatch, newConversation);
    setMessage("");
  };

  const renderFilePreview = (file, index) => {
    const fileURL = URL.createObjectURL(file);
    return (
      <div key={fileURL} className="relative">
        {file.type.startsWith("image") && (
          <img
            src={fileURL}
            alt="preview"
            className="w-32 h-32 object-cover rounded-md"
          />
        )}
        {file.type.startsWith("video") && (
          <video className="w-32 h-32 object-cover rounded-md" controls>
            <source src={fileURL} type={file.type} />
          </video>
        )}
        <button
          onClick={() => removeFile(index)}
          className="absolute top-0 right-0 bg-gray-800 text-white rounded-full p-1"
        >
          ✖
        </button>
      </div>
    );
  };

  const changeMessage = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    reset();
  }, [chatUser, groupChat]);

  return (
    <>
      <input
        type="text"
        placeholder="Message..."
        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-3 mt-2"
        value={message}
        onChange={changeMessage}
      />

      {/* Render previews of selected files above the message input */}
      <div className="mt-2 flex space-x-2">
        {files.map((file, idx) => renderFilePreview(file, idx))}
      </div>

      {/* Icon as a trigger for file input */}
      <label htmlFor="media" className="cursor-pointer ml-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6 text-gray-400 hover:text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16l3.58-4.205a1 1 0 011.642.136l1.76 2.787a1 1 0 001.662 0l3.4-5.093a1 1 0 011.662 0L21 16"
          />
          <circle cx="8" cy="8" r="2" />
        </svg>
      </label>
      <input
        id="media"
        name="media"
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        className="ml-3 text-gray-400 hover:text-white"
        onClick={handleSendMessage}
        disabled={message === "" && files.length === 0}
      >
        ➤
      </button>
    </>
  );
}

export default MessageInput;
