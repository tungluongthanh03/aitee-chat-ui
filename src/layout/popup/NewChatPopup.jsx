import React, { useState } from "react";
import "../../styles/NewChatPopup.css";
import { searchUserOrGroup } from "../../redux/apiRequests";

const NewChatPopup = ({ isOpen, onClose, onStartChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [listTarget, setListTarget] = useState([]);
  const [error, setError] = useState("");

  const reset = () => {
    setSearchQuery("");
    setListTarget([]);
    setError("");
  };

  const handleClickX = () => {
    onClose();
    reset();
  };

  const handleStartChat = (target) => {
    onStartChat(target);
    onClose(); // Close the popup after starting the chat
    reset();
  };

  const handleFind = async () => {
    const response = await searchUserOrGroup(searchQuery);
    if (response.data.success) {
      setListTarget(response.data.listTarget);
    } else {
      setError(response.data.message);
      setListTarget([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">New Message</h2>
          <button className="popup-close" onClick={handleClickX}>
            ✖
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Type a username..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setError("");
              setListTarget([]);
            }}
            className="popup-input"
          />
        </div>
        {listTarget.length !== 0 ? (
          <div className="popup-list">
            {listTarget.map((target) => (
              <div
                key={target.targetId}
                onClick={() => handleStartChat(target)}
                className={`flex items-center p-3 rounded-lg transition cursor-pointer my-2 hover:bg-gray-800`}
              >
                <img
                  src={
                    target.targetAvatar
                      ? target.targetAvatar
                      : target.targetType === "user"
                      ? "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1gV7Edmn4Kmaz5tlr5d3K0Cyn17qa1Z-MCQ&s"
                  }
                  alt={target.targetName}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-white font-semibold">
                    {target.targetName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="font-semibold text-red-500 mt-2 popup-error">
            {error}
          </div>
        )}
        <button
          className="popup-button font-bold"
          onClick={handleFind}
          disabled={searchQuery === "" || listTarget.length > 0}
        >
          Find User or Group
        </button>
      </div>
    </div>
  );
};

export default NewChatPopup;
