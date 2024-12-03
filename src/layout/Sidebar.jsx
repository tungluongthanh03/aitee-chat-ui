import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewConversation,
  getChatTarget,
  getConversations,
  getMessages,
} from "../redux/apiRequests";
import PopupMenu from "./PopupMenu";
import NewChatPopup from "./NewChatPopup";
import { useSocket } from "./SocketContext";
import NewGroupPopup from "./NewGroupPopup";

const Sidebar = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [isPopupOpenGroup, setIsPopupOpenGroup] = useState(false); // Popup state
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
        await getConversations(dispatch); // Safe async call
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }
    fetchConversations();
  }, [dispatch]);

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

      // socket.on("receivedMessage", (message) => {

      // });

      return () => {
        console.log("Cleaning up socket listeners");
        socket.off("connect");
        socket.off("friendsOnline");
      };
    }
  }, [socket, currentUser, onlineFriends]);

  function openMore() {
    setIsOpen(!isOpen);
  }

  const openPopup = () => setIsPopupOpen(true); // Open popup
  const closePopup = () => setIsPopupOpen(false); // Close popup

  const openPopupGroup = () => setIsPopupOpenGroup(true); // Open popup group
  const closePopupGroup = () => setIsPopupOpenGroup(false); // Close popup group

  const startNewChat = async (target) => {
    getChatTarget(dispatch, target);
    getMessages(dispatch, target.targetId);
  };

  const handleClick = useCallback(
    (target) => {
      if (selectedUserId !== target?.targetId) {
        setSelectedUserId(target?.targetId);
        getChatTarget(dispatch, target);
        getMessages(dispatch, target?.targetId);
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
          <button
            className="p-2 text-gray-400 hover:text-white"
            onClick={openPopupGroup}
          >
            👥
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

      <NewGroupPopup isOpen={isPopupOpenGroup} onClose={closePopupGroup} />

      {/* Online Users */}

      <div className="flex overflow-x-auto mx-2 mb-6 mt-2 py-2 px-1 scrollbar-hide">
        {limitedOnlineUsers?.map((target) => (
          <div
            key={target.targetId}
            className="relative mr-2 group"
            onClick={() => handleClick({ ...target, targetType: "user" })}
          >
            <img
              src={
                target.targetAvatar ||
                "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
              }
              alt="Online User"
              className="w-11 h-11 rounded-full border-2 border-green-500 hover:scale-110 transition-transform"
            />
            <div className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 text-xs bg-gray-700 text-white py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50">
              {target.username || "Unknown"}
            </div>
            {/* Optional: Badge for online status */}
            <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
          </div>
        ))}
      </div>

      {/* Messages List with Custom Scrollbar */}
      <h3 className="text-xl font-bold mb-4">Messages</h3>
      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-custom">
        {conversations?.list.map((target) => (
          <div
            key={target.targetId}
            onClick={() => handleClick(target)}
            className={`flex items-center p-3 rounded-lg transition cursor-pointer ${
              selectedUserId === target.targetId
                ? "bg-gray-800"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            <img
              src={
                target.targetAvatar
                  ? target.targetAvatar
                  : target.targetType == "user"
                  ? "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1gV7Edmn4Kmaz5tlr5d3K0Cyn17qa1Z-MCQ&s"
              }
              alt={target.targetName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-white font-semibold">{target.targetName}</p>
              <p className="text-gray-400 text-sm">
                {target.targetId == currentUser.id ? "You: " : ""}
                {target.lastMessage}
              </p>
              {/* <p className="text-gray-400 text-sm">{target.createdAt}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
