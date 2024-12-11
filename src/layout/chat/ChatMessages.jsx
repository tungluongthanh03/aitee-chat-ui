import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../SocketContext";
import {
  addHandledMediaMessage,
  addNewConversation,
  addNewMessage,
  getMessages,
  loadMoreMessages,
} from "../../redux/apiRequests";
import LoadingIcon from "../LoadingIcon";

function ChatMessages({ chatUser, groupChat, currentUser, dispatch }) {
  const [enlargedImage, setEnlargedImage] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [page, setPage] = useState(0);

  const messages = useSelector((state) => state.messages);
  // const [hasMore, setHasMore] = useState(messages.list?.length == 20);


  const chatRef = useRef(null);
  const chatUserRef = useRef(chatUser);
  const groupChatRef = useRef(groupChat);

  const socket = useSocket();

  const closeModal = () => setEnlargedImage(false);

  // const fetchOlderMessages = async () => {
  //   if (!hasMore || isLoading) return;
  //   setIsLoading(true);

  //   setTimeout(async () => {
  //     try {
  //       const data = await loadMoreMessages(
  //         dispatch,
  //         chatUser.id || groupChat.id,
  //         page
  //       );
  //       if (data?.length < 20) setHasMore(false); // No more messages to load
  //       setPage((prev) => prev + 1);
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   }, 1000);
  //   setIsLoading(false);
  // };

  // const handleScroll = () => {
  //   if (!chatRef.current) return;
  //   const { scrollTop } = chatRef.current;

  //   if (scrollTop === 0 && hasMore) {
  //     fetchOlderMessages(); // Fetch messages when at the top
  //   }
  // };

  // useEffect(() => {
  //   const chatWindow = chatRef.current;
  //   if (!chatWindow) return;

  //   chatWindow.addEventListener("scroll", handleScroll);
  //   return () => chatWindow.removeEventListener("scroll", handleScroll);
  // }, [hasMore, isLoading]);

  // Scroll to the bottom of the chat window when new messages are added
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages?.list]);

  // keep track of the current chat user and group chat (the listener event can't do it by itself)
  useEffect(() => {
    chatUserRef.current = chatUser;
    groupChatRef.current = groupChat;
  }, [chatUser, groupChat]);

  useEffect(() => {
    const handleReceivedMessage = (message) => {
      addNewMessage(dispatch, message);
    };

    socket.on("handledMedia", (media) => {
      addHandledMediaMessage(dispatch, media);
    });

    socket.on("receivedMessage", (receivedMessage) => {
      const { sendFrom, content, username, userAvatar, createdAt } =
        receivedMessage;

      const newConversation = {
        targetType: "user",
        targetId: sendFrom,
        targetName: username,
        targetAvatar: userAvatar,
        lastMessage: content,
        createdAt,
      };
      addNewConversation(dispatch, newConversation);
      if (sendFrom === chatUserRef.current?.id) {
        handleReceivedMessage(receivedMessage);
      }
    });

    socket.on("receivedMessageGroup", (receivedMessage) => {
      const {
        content,
        sendFrom,
        groupName,
        groupChatAvatar,
        sendToGroupChat,
        createdAt,
      } = receivedMessage;

      console.log(receivedMessage);

      if (sendFrom !== currentUser.id) {
        // don't do that for client of sender
        const newConversation = {
          targetType: "group",
          targetId: sendToGroupChat,
          targetName: groupName,
          targetAvatar: groupChatAvatar,
          lastMessage: content,
          createdAt,
        };
        addNewConversation(dispatch, newConversation);
        if (sendToGroupChat === groupChatRef.current?.id) {
          handleReceivedMessage(receivedMessage);
        }
      }
    });

    return () => {
      socket.off("receivedMessage", handleReceivedMessage);
      socket.off("receivedMessageGroup", handleReceivedMessage);
      socket.off("handledMedia");
    };
  }, [dispatch, socket]);

  return (
    <>
      <div
        className="flex-1 space-y-4 overflow-y-auto scrollbar-custom p-4"
        ref={chatRef}
        style={{
          overflowY: "auto",
        }}
      >
        {messages?.list.map((msg, idx) => {
          const isFirstInSequence =
            idx === messages.list.length - 1 ||
            msg.sendFrom !== messages.list[idx + 1].sendFrom;

          return (
            <div
              key={msg.messageID}
              className={`flex items-end ${
                msg.sendFrom === currentUser.id ? "justify-end" : ""
              } ${isFirstInSequence ? "mt-4" : "mt-1"} space-x-2`}
            >
              {/* Render Avatar */}
              {msg.sendFrom !== currentUser.id && (
                <div className="w-10 h-10 flex-shrink-0 relative group">
                  {isFirstInSequence ? (
                    <>
                      <img
                        src={
                          chatUser?.avatar ||
                          groupChat.list.find(
                            (user) => user.userid === msg.sendFrom
                          )?.avatar ||
                          "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                        }
                        alt="sender Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      {/* Render Username on Hover */}
                      <span
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs bg-black/80 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          whiteSpace: "nowrap", // Prevents text from wrapping
                        }}
                      >
                        {(groupChat.id !== null &&
                          groupChat.list.find(
                            (user) => user.userid === msg.sendFrom
                          )?.username) ||
                          chatUser?.username ||
                          "Aitee's user"}
                      </span>
                    </>
                  ) : (
                    // Placeholder for alignment
                    <div className="w-10 h-10" />
                  )}
                </div>
              )}
              <div
                className={`flex flex-col max-w-lg space-y-1 ${
                  msg.sendFrom === currentUser.id ? "items-end" : "items-start"
                }`}
              >
                {/* Message Content */}
                {msg.content && (
                  <div
                    className={`relative group px-4 py-2 rounded-3xl text-sm ${
                      msg.sendFrom === currentUser.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <p>{msg.content}</p>
                    <span
                      className={`absolute bottom-full ${
                        msg.sendFrom === currentUser.id ? "right-2" : "left-1"
                      } text-xs bg-black/60 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity`}
                      style={{
                        width: "150px", // Set a fixed width
                        textAlign: "center", // Align text to the center
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Render Video Files */}
                {msg.videos?.map((video, idx) => (
                  <div key={video} className="relative group w-fit max-w-sm">
                    <video
                      controls
                      className="rounded-lg shadow-md w-full"
                      src={video}
                      alt="message media"
                    />
                    <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded hidden group-hover:block">
                      Click to play
                    </span>
                  </div>
                ))}

                {/* Render Image Files */}
                {msg.images?.map((img) => (
                  <button
                    key={img}
                    className="relative group w-fit max-w-sm"
                    onClick={() => setEnlargedImage(img)}
                  >
                    <img
                      src={img}
                      alt="message media"
                      className="rounded-lg shadow-md"
                    />
                    <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded hidden group-hover:block">
                      Click to enlarge
                    </span>
                  </button>
                ))}
                {/* render loading images/videos icon */}
                {msg.media?.length > 0 && <LoadingIcon />}
              </div>
            </div>
          );
        })}
      </div>

      {/* enlarge the image when click it */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeModal} // Close the modal when clicking outside the image
        >
          <img
            src={enlargedImage}
            alt=""
            className="max-w-full max-h-full object-contain cursor-pointer"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
    </>
  );
}

export default ChatMessages;
