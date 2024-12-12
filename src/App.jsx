import React, { useEffect, useState } from "react";
import "./styles/global.css";
import Sidebar from "./layout/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser, getUser } from "./redux/apiRequests";
import ChatWindow from "./layout/chat/ChatWindow";
import LoadingIcon from "./layout/LoadingIcon";

const ChatApp = () => {
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [username, setLocalUsername] = useState("");
  const [id, setLocalId] = useState("");

  // const handleLogin = () => {
  //   if (username && id) {
  //     const user = {
  //       email: username,
  //       password: id
  //     };
  //     getUser(dispatch, user);
  //   }
  // };

  // get token from session port 3000, store it in session storage port 30001
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === 'http://localhost:3000') {
        const { token } = event.data;
        console.log('Received token:', token);
        // Store token in session storage or use it directly
        sessionStorage.setItem('token', token);
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (currentUser?.username) {
      const fetchUser = async () => {
        await getCurrentUser(dispatch);
      }
      fetchUser();
    }
  }, []);
  

  if(currentUser?.username === null) {
    return <LoadingIcon />;
  }

  // if (currentUser?.username == null) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
  //       <div className="bg-white p-6 rounded shadow-md">
  //         <h2 className="text-lg font-bold mb-4">Enter Your Username</h2>
  //         <input
  //           id="username"
  //           type="text"
  //           className="border border-gray-300 p-2 rounded w-full mb-4 text-black"
  //           placeholder="Username"
  //           value={username}
  //           onChange={(e) => setLocalUsername(e.target.value)}
  //         />
  //         <h2 className="text-lg font-bold mb-4">Enter Your Username</h2>
  //         <input
  //           id="id"
  //           type="text"
  //           className="border border-gray-300 p-2 rounded w-full mb-4 text-black"
  //           placeholder="id"
  //           value={id}
  //           onChange={(e) => setLocalId(e.target.value)}
  //         />
          
  //         <button
  //           className="bg-blue-500 text-white px-4 py-2 rounded w-full"
  //           onClick={handleLogin}
  //         >
  //           Login
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen mx-2">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatApp;
