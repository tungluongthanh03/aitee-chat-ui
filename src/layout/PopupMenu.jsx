import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/apiRequests';
import { useSocket } from './SocketContext';

const PopupMenu = ({isOpen, setIsOpen}) => {

  const dispatch = useDispatch();
  const socket = useSocket();

  const togglePopup = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    // Logout logic here
    logout(dispatch);
    socket.emit("disconnect");
  }

  return (
    <div className="relative">
      

      {/* Popup Overlay */}
      {isOpen && (
        <div
        className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-40"
        onClick={togglePopup} // Close when clicking the background
      >
        {/* Popup Content */}
        <div
          className="bg-zinc-900 text-white rounded-xl shadow-2xl p-8 w-80 space-y-6 z-50"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
        >
          {/* Popup Header */}
          <div className="text-2xl font-extrabold text-center border-b border-gray-700 pb-4">
            MORE
          </div>
      
          {/* Popup Buttons */}
          <button className="block w-full text-center text-lg font-bold hover:text-gray-400">
            Mute/Unmute
          </button>
          <button className="block w-full text-center text-lg font-bold hover:text-gray-400">
            Newsfeed
          </button>
          <button className="block w-full text-center text-lg font-bold hover:text-gray-400" onClick={handleLogout}>
            Log Out
          </button>
          
        </div>
      </div>
      
      )}
    </div>
  );
};

export default PopupMenu;
