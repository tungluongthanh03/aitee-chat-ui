import React, { useState } from "react";
import "../styles/NewChatPopup.css";

const NewChatPopup = ({ isOpen, onClose, onStartChat }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleStartChat = () => {
    setSearchQuery("");
    onStartChat(searchQuery);
    onClose(); // Close the popup after starting the chat
  };

  if (!isOpen) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">New Message</h2>
          <button className="popup-close" onClick={onClose}>
            ✖
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Type a username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="popup-input"
          />
        </div>
        <button className="popup-button font-bold" onClick={handleStartChat} disabled={searchQuery == ""}>
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default NewChatPopup;
