import React, { useState } from "react";
import "./styles/global.css";
import Sidebar from "./layout/Sidebar";
import ChatWindow from "./layout/ChatWindow";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "./redux/apiRequests";

const ChatApp = () => {
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [username, setLocalUsername] = useState("");
  const [id, setLocalId] = useState("");

  const handleLogin = () => {
    if (username && id) {
      const user = {
        email: username,
        password: id
      };
      getUser(dispatch, user);
    }
  };

  if (currentUser?.username == null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-bold mb-4">Enter Your Username</h2>
          <input
            id="username"
            type="text"
            className="border border-gray-300 p-2 rounded w-full mb-4 text-black"
            placeholder="Username"
            value={username}
            onChange={(e) => setLocalUsername(e.target.value)}
          />
          <h2 className="text-lg font-bold mb-4">Enter Your Username</h2>
          <input
            id="id"
            type="text"
            className="border border-gray-300 p-2 rounded w-full mb-4 text-black"
            placeholder="id"
            value={id}
            onChange={(e) => setLocalId(e.target.value)}
          />
          
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen mx-2">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatApp;
