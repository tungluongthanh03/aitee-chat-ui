import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import NewChatPopup from "./NewChatPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewConversation,
  addNewMessage,
  getChatTarget,
  getMessages,
} from "../redux/apiRequests";
import { useSocket } from "./SocketContext";
import DetailAreaGroup from "./DetailAreaGroup";

const ChatWindow = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state

  const currentUser = useSelector((state) => state.user);
  const chatUser = useSelector((state) => state.chatUser);

  const groupChat = useSelector((state) => state.groupChat);
  const messages = useSelector((state) => state.messages);

  const chatRef = useRef(null);
  const chatUserRef = useRef(chatUser);
  const groupChatRef = useRef(groupChat);

  useEffect(() => {
    chatUserRef.current = chatUser;
    groupChatRef.current = groupChat;
  }, [chatUser, groupChat]);

  const dispatch = useDispatch();
  const socket = useSocket();

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  const openPopup = () => setIsPopupOpen(true); // Open popup
  const closePopup = () => setIsPopupOpen(false); // Close popup

  const startNewChat = async (target) => {
    getChatTarget(dispatch, target);
    getMessages(dispatch, target.targetId);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleReceivedMessage = (message) => {
      addNewMessage(dispatch, message);
    };

    socket.on("receivedMessage", (receivedMessage) => {
      const { sendFrom, content, username, userAvatar } = receivedMessage;

      console.log(receivedMessage);
      const newConversation = {
        targetType: "user",
        targetId: sendFrom,
        targetName: username,
        targetAvatar: userAvatar,
        lastMessage: content,
      };
      addNewConversation(dispatch, newConversation);
      if (sendFrom === chatUserRef.current?.id) {
        handleReceivedMessage(receivedMessage);
      }
    });

    socket.on("receivedMessageGroup", (receivedMessage) => {
      const { content, groupName, groupChatAvatar, sendToGroupChat } =
        receivedMessage;

      const newConversation = {
        targetType: "group",
        targetId: sendToGroupChat,
        targetName: groupName,
        targetAvatar: groupChatAvatar,
        lastMessage: content,
      };
      addNewConversation(dispatch, newConversation);
      if (sendToGroupChat === groupChatRef.current?.id) {
        handleReceivedMessage(receivedMessage);
      }
    });

    return () => {
      socket.off("receivedMessage", handleReceivedMessage);
      socket.off("receivedMessageGroup", handleReceivedMessage);
    };
  }, [dispatch, socket]);

  return (
    <div className="flex h-full w-full">
      <NewChatPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onStartChat={startNewChat}
      />
      {/* Main Chat Area */}
      {chatUser.id == null && groupChat.id == null ? (
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
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={openPopup}
            >
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
                  src={chatUser?.avatar || groupChat.avatar}
                  alt="Chat Target"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="font-bold">
                  {chatUser?.username || groupChat.name}
                </span>
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
            <div
              className="flex-1 space-y-4 overflow-y-auto scrollbar-custom p-4"
              ref={chatRef}
              style={{
                overflowY: "auto",
              }}
            >
              {messages?.list.map((msg, idx) => (
                <div
                  key={msg.messageID}
                  className={`flex items-end ${
                    msg.sendFrom === currentUser.id ? "justify-end" : ""
                  }`}
                >
                  {msg.sendFrom !== currentUser.id && (
                    <div className="relative group">
                      <img
                        src={
                          chatUser?.avatar ||
                          (() => {
                            const sender =
                              groupChat.list.find(
                                (user) => user.userid === msg.sendFrom
                              )?.avatar ||
                              "https://cdn-icons-png.flaticon.com/512/9187/9187604.png";
                            return sender; // Return sender's avatar if found
                          })
                        }
                        alt="sender Avatar"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="absolute bottom-[110%] left-1/2 transform -translate-x-1/2 text-xs bg-gray-700 text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {chatUser?.username ||
                          groupChat.list.find(
                            (user) => user.userid === msg.sendFrom
                          )?.username}
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-lg px-3 py-2 rounded-3xl text-[15px] ${
                      msg.sendFrom === currentUser.id
                        ? "bg-blue-500 text-left"
                        : "bg-gray-800 text-left"
                    }
                    `}
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {msg.sendFrom !== currentUser.id &&
                      chatUser.id === null && (
                        <p>
                          {groupChat.list.forEach((user) => {
                            // get sender's avatar from groupChat
                            if (user.id === msg.sendFrom) {
                              return user.avatar;
                            }
                          })}
                        </p>
                      )}
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
                  src={chatUser?.avatar || groupChat.avatar}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full mb-4"
                />
                <span className="text-lg font-bold">
                  {chatUser?.username || groupChat.name}
                </span>
                <div className="mt-8 space-y-4 w-full">
                  {chatUser.username === null ? (
                    <>
                      <DetailAreaGroup groupChat={groupChat} currentUser={currentUser} />
                    </>
                  ) : (
                    <>
                      <button className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700">
                        Report
                      </button>
                      <button className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700">
                        Block
                      </button>
                      <button className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700">
                        Delete Chat
                      </button>
                    </>
                  )}
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
