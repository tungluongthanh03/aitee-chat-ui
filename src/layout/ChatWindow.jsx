// ChatWindow.js
import React from "react";



const ChatWindow = ({ messages, chatUser }) => {
  
  return (
    <>
      {chatUser.username == null ? (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex justify-center items-center rounded-full bg-gray-800">
                {/* Icon can be added here */}
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
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
              Send message
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-black text-white p-4 flex flex-col">
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
              <button className="hover:text-white">ℹ️</button>
            </div>
          </div>

          {/* Chat Messages with Custom Scrollbar */}
          <div className="flex-1 space-y-4 overflow-y-auto scrollbar-custom p-4">
            {messages.map((msg, index) => (
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
            <input
              type="text"
              placeholder="Message..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-3"
            />
            <button className="ml-3 text-gray-400 hover:text-white">➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWindow;
