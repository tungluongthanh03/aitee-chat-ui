import React, { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import NewChatPopup from "./NewChatPopup";
import { useDispatch, useSelector } from "react-redux";
import { addNewMessage, getChatUser, getMessages, startChat } from "../redux/apiRequests";
import { useSocket } from "./SocketContext";


const ChatWindow = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const chatUser = useSelector((state) => state.chatUser);
  const messages = useSelector((state) => state.messages);

  const dispatch = useDispatch();
  const socket = useSocket();


  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  const openPopup = () => setIsPopupOpen(true); // Open popup
  const closePopup = () => setIsPopupOpen(false); // Close popup

  const startNewChat = async (username) => {
    const newChat = await startChat(username);
    if(newChat.data.success) {
      getChatUser(dispatch, newChat.data.user[0]);
      getMessages(dispatch, newChat.data.user[0].id);
    } else {
      alert("Error starting chat: " + newChat.data.message);
    }
  };

  useEffect(() => {
    socket.on("receivedMessage", (message) => {
      const { username, avatar, sendFrom, content } = message;
      const newMessage = {
        sender: username,
        content: content,
        avatar: avatar,
      }
      console.log(newMessage);
      addNewMessage(dispatch, newMessage);
    });
  })

  return (
    <div className="flex h-full w-full">
      <NewChatPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onStartChat={startNewChat}
      />
      {/* Main Chat Area */}
      {chatUser.username == null ? (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex justify-center items-center rounded-full bg-gray-800">
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.5 2.5C1.12 2.5 0 3.62 0 5s1.12 2.5 2.5 2.5H5v2.5l5-5-5-5v2.5H2.5zM15 5h-1.5v2.5l-5 5 5 5V15h1.5C18.88 15 20 13.88 20 12.5S18.88 10 17.5 10H15v-2.5l-5 5 5 5V15h2.5C18.88 15 20 13.88 20 12.5S18.88 10 17.5 10H15V5z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-medium mb-2">Your messages</h2>
            <p className="text-gray-400 mb-4">
              Send a message to start a chat.
            </p>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600" onClick={openPopup}>
              Send message
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`bg-black text-white p-4 flex flex-col ${
              showDetail ? "w-2/3" : "w-full"
            } h-full`}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-2">
              <div className="flex items-center">
                <img
                  src={chatUser.avatar}
                  alt="Chat User"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="font-bold">{chatUser.username}</span>
              </div>
              <div className="flex space-x-6 mr-5 text-gray-400">
                <button className="hover:text-white">📞</button>
                <button className="hover:text-white">📹</button>
                <button className="hover:text-white" onClick={toggleDetail}>
                  ℹ
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto scrollbar-custom p-4">
              {messages?.list.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end ${
                    msg.sender === "me" ? "justify-end" : ""
                  }`}
                >
                  {msg.sender !== "me" && (
                    <img
                      src={msg.avatar}
                      alt="Sender Avatar"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <div
                    className={`max-w-lg py-2 px-3 rounded-3xl text-[15px] ${
                      msg.sender === "me"
                        ? "bg-blue-500 text-left"
                        : "bg-gray-800 text-left"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="mt-4 flex items-center p-3 bg-gray-800 rounded-full">
              <MessageInput />
            </div>
          </div>

          {/* Detail Area */}
          {showDetail && (
            <div className="w-1/3 bg-black text-white border-l border-gray-600 p-4 h-full">
              <h3 className="text-xl font-bold mb-4 text-center">Details</h3>
              <div className="flex flex-col items-center">
                <img
                  src={chatUser.avatar}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full mb-4"
                />
                <span className="text-lg font-bold">{chatUser.username}</span>
                <div className="mt-8 space-y-4 w-full">
                  <button className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600">
                    Report
                  </button>
                  <button className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600">
                    Block
                  </button>
                  <button className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600">
                    Delete Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatWindow;
