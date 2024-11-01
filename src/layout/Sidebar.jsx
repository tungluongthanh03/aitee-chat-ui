import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCHatUser } from "../redux/apiRequests";

const Sidebar = ({ currentUser, chattedUsers, onlineUsers }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Limit the number of online users displayed
  const limitedOnlineUsers = onlineUsers.slice(0, 6); // Show only the first 8 online users

  // Optionally, you can randomize the displayed users
  // const limitedOnlineUsers = [...onlineUsers].sort(() => 0.5 - Math.random()).slice(0, 8);

  const dispatch = useDispatch();

  const selectUser = () => {
    console.log("User selected");
    updateCHatUser(dispatch);
  }

  return (
    <div className="bg-black text-white w-1/4 p-4 flex flex-col">
      {/* Header - Current User & Online Users */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src={currentUser.avatar}
            alt="Current User"
            className="w-12 h-12 rounded-full border-2 border-green-500"
          />
          <span className="ml-4 text-2xl font-extrabold">
            {currentUser.username}
          </span>
        </div>
        <div>
          <button className="p-2 text-gray-400 hover:text-white">✏️</button>
          <button className="p-2 text-gray-400 hover:text-white">⚙️</button>
        </div>
      </div>

      {/* Online Users */}

      <div className="flex overflow-x-auto mx-2 mb-6 mt-2 py-2 px-1 scrollbar-hide">
        {limitedOnlineUsers.map((user) => (
          <div key={user.id} className="relative mr-2">
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
      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-custom" onClick={selectUser}>
        {chattedUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUserId(user.id)}
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
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;
