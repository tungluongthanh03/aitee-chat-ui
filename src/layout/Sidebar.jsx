import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewConversation,
  getChatUser,
  getConversations,
  getMessages,
  startChat,
} from "../redux/apiRequests";
import PopupMenu from "./PopupMenu";
import NewChatPopup from "./NewChatPopup";
import { useSocket } from "./SocketContext";

const Sidebar = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [onlineFriends, setOnlineFriends] = useState([]);

  const conversations = useSelector((state) => state.conversations);
  const currentUser = useSelector((state) => state.user);

  // Limit the number of online users displayed
  const limitedOnlineUsers = Array.isArray(onlineFriends)
  ? onlineFriends.slice(0, 6)
  : [];

  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchConversations() {
      try {
        await getConversations(dispatch, currentUser.id); // Safe async call
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }
    fetchConversations();
  }, [dispatch, currentUser.id]);
  


  useEffect(() => {
    if (socket) {
      if (socket.connected) {
        socket.emit("userConnected", currentUser);
        socket.emit("getFriendsOnline", currentUser);
      }
  
      socket.on("friendsOnline", (friends) => {
        if (
          Array.isArray(friends) &&
          JSON.stringify(friends) !== JSON.stringify(onlineFriends)
        ) {
          setOnlineFriends(friends);
        }
      });
  
      socket.on("receivedMessage", (message) => {
        console.log("Received Message:", message);
        const { username, avatar, sendFrom, content } = message;
        const newConversation = {
          id: sendFrom,
          username,
          avatar,
          latestMessage: content,
        };
        if (!conversations.list.some((conv) => conv.id === sendFrom)) {
          addNewConversation(dispatch, newConversation);
        }
      });
  
      return () => {
        console.log("Cleaning up socket listeners");
        socket.off("connect");
        socket.off("friendsOnline");
        socket.off("receivedMessage");
      };
    }
  }, [socket, currentUser, onlineFriends]);
  

  function openMore() {
    setIsOpen(!isOpen);
  }

  const openPopup = () => setIsPopupOpen(true); // Open popup
  const closePopup = () => setIsPopupOpen(false); // Close popup

  const startNewChat = async (username) => {
    const newChat = await startChat(username);
    if(newChat.data.success) {
      getChatUser(dispatch, newChat.data.user[0]);
      getMessages(dispatch, newChat.data.user[0].id);
    } else {
      console.error("Error starting chat:", newChat.data.message);
    }
  };

  const handleClick = useCallback(
    (user) => {
      if (selectedUserId !== user?.friendid) {
        setSelectedUserId(user?.id || user.friendid);
        getChatUser(dispatch, user);
        getMessages(dispatch, currentUser.id, user?.id || user.friendid);
      }
    },
    [selectedUserId, dispatch, currentUser.id]
  );
  
  
  
  

  return (
    <div className="bg-black text-white w-1/3 p-4 flex flex-col">
      {/* Header - Current User & Online Users */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src={currentUser?.avatar}
            alt="Current User"
            className="w-12 h-12 rounded-full border-2 border-green-500"
          />
          <span className="ml-4 text-2xl font-extrabold">
            {currentUser?.username}
          </span>
        </div>
        <div>
          <button
            className="p-2 text-gray-400 hover:text-white"
            onClick={openPopup}
          >
            ✏️
          </button>
          {!isOpen ? (
            <button
              className="p-2 text-gray-400 hover:text-white"
              onClick={openMore}
            >
              ⚙️
            </button>
          ) : (
            <>
              <button
                className="p-2 text-gray-400 hover:text-white"
                onClick={openMore}
              >
                ⚙️
              </button>
              <PopupMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            </>
          )}
        </div>
      </div>
      <NewChatPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onStartChat={startNewChat}
      />

      {/* Online Users */}

      <div className="flex overflow-x-auto mx-2 mb-6 mt-2 py-2 px-1 scrollbar-hide">
        {limitedOnlineUsers?.map((user) => (
          <div key={user.friendid} className="relative mr-2" onClick={() => handleClick(user)}>
            <img
              src={user.avatar}
              alt="Online User"
              className="w-11 h-11 rounded-full border-2 border-green-500 hover:scale-110 transition-transform"
            />
            {/* Optional: Badge for online status */}
            <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
          </div>
        ))}
      </div>

      {/* Messages List with Custom Scrollbar */}
      <h3 className="text-xl font-bold mb-4">Messages</h3>
      <div
        className="flex-1 space-y-2 overflow-y-auto scrollbar-custom"
      >
        {conversations?.list.map((user) => (
          <div
            key={user.id}
            onClick={() => handleClick(user)}
            className={`flex items-center p-3 rounded-lg transition cursor-pointer ${
              selectedUserId === user.id
                ? "bg-gray-700"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-white font-semibold">{user.username}</p>
              <p className="text-gray-400 text-sm">{user.latestMessage}</p>
              {/* <p className="text-gray-400 text-sm">{user.createdAt}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
