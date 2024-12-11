import React, { useState } from "react";
import NewChatPopup from "../popup/NewChatPopup";
import { getChatTarget } from "../../redux/apiRequests";

function NoTarget({ dispatch }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true); // Open popup
  const closePopup = () => setIsPopupOpen(false); // Close popup

  // just called when user have not clicked on any conversation
  const startNewChat = async (target) => {
    getChatTarget(dispatch, target);
  };

  return (
    <>
      <NewChatPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onStartChat={startNewChat}
      />
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-gray-800">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.5 2.5C1.12 2.5 0 3.62 0 5s1.12 2.5 2.5 2.5H5v2.5l5-5-5-5v2.5H2.5zM15 5h-1.5v2.5l-5 5 5 5V15h1.5C18.88 15 20 13.88 20 12.5S18.88 10 17.5 10H15v-2.5l-5 5 5 5V15h2.5C18.88 15 20 13.88 20 12.5S18.88 10 17.5 10H15V5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-medium mb-2">Your messages</h2>
          <p className="text-gray-400 mb-4">Send a message to start a chat.</p>
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
            onClick={openPopup}
          >
            Send message
          </button>
        </div>
      </div>
    </>
  );
}

export default NoTarget;
