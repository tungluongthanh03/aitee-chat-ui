import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import MessageInput from "./MessageInput";


function ChatWindow({ socket, currentUserId, conversationUserId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const chatWindowRef = useRef(null);

  const limit = 20;



  // const loadMessages = async () => {
  //   if (loading || !hasMore) return;

  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`/messages/${conversationUserId}`, {
  //       params: { limit, offset },
  //     });
  //     if (response.data.length < limit) {
  //       setHasMore(false);
  //     }
  //     setMessages((prevMessages) => [...response.data, ...prevMessages]);
  //     setOffset(offset + limit);
  //   } catch (error) {
  //     console.error("Error fetching messages: ", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const chatWindow = chatWindowRef.current;

  //   const handleScroll = () => {
  //     if (chatWindow.scrollTop === 0 && hasMore && !loading) {
  //       loadMessages();
  //     }
  //   };

  //   chatWindow.addEventListener("scroll", handleScroll);

  //   return () => {
  //     chatWindow.removeEventListener("scroll", handleScroll);
  //   };
  // }, [hasMore, loading]);

  

  useEffect(() => {
    // loadMessages();

    // Listen for incoming messages via Socket.IO
    socket.on("receiveMessage", (message) => {
      if (
        (message.sendFrom === conversationUserId &&
          message.sendTo === currentUserId) ||
        (message.sendFrom === currentUserId &&
          message.sendTo === conversationUserId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]); // Append new message to the state
      }
    });

    // Cleanup: Unsubscribe from the socket when the component unmounts
    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationUserId, currentUserId]);

  return (
    <div
      className="chat-window"
      ref={chatWindowRef}
      style={{ height: "400px", overflowY: "auto" }}
    >
      {loading && <p>Loading...</p>}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.sendFrom === currentUserId ? "justify-end" : "justify-start"
          } mb-2`}
        >
          <div
            className={`p-2 rounded-lg max-w-xs ${
              msg.sendFrom === currentUserId
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
      <MessageInput socket={socket}/>
    </div>
  );
};

export default ChatWindow;
