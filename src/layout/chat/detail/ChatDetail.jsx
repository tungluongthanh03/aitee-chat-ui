import React, { useEffect, useState } from "react";
import DetailAreaUser from "./DetailAreaUser";
import DetailAreaGroup from "./DetailAreaGroup";
import { FaCamera, FaPencilAlt } from "react-icons/fa";
import { updateGroupAvatar, updateGroupName } from "../../../redux/apiRequests";

function ChatDetail({ chatUser, groupChat, currentUser }) {
  const [enlargedImage, setEnlargedImage] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [file, setFile] = useState(null);

  const [newGroupName, setNewGroupName] = useState(groupChat.name);

  const reset = () => {
    setEnlargedImage(false);
    setIsEditingName(false);
    setFile(null);
    setNewGroupName(groupChat.name);
  };

  const closeModal = () => setEnlargedImage(false);

  // Handle group name change
  const handleGroupNameChange = async () => {
    if (newGroupName !== groupChat.name) {
      // Call API to update group name
      console.log("New Group Name:", newGroupName);
      const res = await updateGroupName(groupChat.id, newGroupName);
      if(res.success) {
        alert("Group name changed successfully");
      } else {
        alert("Error changing group name", res.message);
      }
    }
    setIsEditingName(false);
  };

  // Handle avatar change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // Convert FileList to Array
    setFile(selectedFile); // Append new files to existing state
  };

  const handleChangeAvatar = async () => {
    // Call API to update avatar
    if (file) {
      console.log("Changing Avatar...", file);

      // Construct a FormData object
      const formData = new FormData();
      formData.append("groupID", groupChat.id); // Add group ID
      formData.append("avatar", file); // Add the first file in the array

      const res = await updateGroupAvatar(formData);
      if (res.success) {
        alert("Avatar changed successfully");
      } else {
        alert("Error changing avatar", res.message);
      }
      closeModal();
      reset();
    } else {
      alert("No image selected");
    }
  };

  useEffect(() => {
    reset();
  }, [chatUser, groupChat]);

  return (
    <div className="w-1/3 bg-black text-white border-l border-gray-600 p-4 h-full">
      <h3 className="text-xl font-bold mb-4 text-center">Details</h3>
      <div className="flex flex-col items-center relative">
        {/* Avatar */}
        <div
          className="relative cursor-pointer mb-2"
          onClick={() => setEnlargedImage(chatUser?.avatar || groupChat.avatar)}
        >
          <img
            src={chatUser?.avatar || groupChat.avatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full mb-4"
          />
          {chatUser?.username === null && (
            <>
              {/* Camera Icon */}
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full cursor-pointer"
              >
                <FaCamera color="white" />
              </label>
              <input
                id="avatarUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>

        {/* Group Name with Pencil Icon */}
        {chatUser?.username === null && (
          <div className="flex items-center space-x-2">
            {isEditingName ? (
              <>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    placeholder="Enter new group name"
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                    onClick={handleGroupNameChange}
                  >
                    Change
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-lg font-bold">{groupChat.name}</span>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsEditingName(true)}
                >
                  <FaPencilAlt />
                </button>
              </>
            )}
          </div>
        )}

        {chatUser?.username && (
          <span className="text-lg font-bold">{chatUser.username}</span>
        )}

        <div className="mt-8 space-y-4 w-full">
          {chatUser?.username === null ? (
            <DetailAreaGroup groupChat={groupChat} currentUser={currentUser} />
          ) : (
            <DetailAreaUser
              chatUserId={chatUser.id}
              currentUserId={currentUser.id}
            />
          )}
        </div>
      </div>

      {/* Avatar Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeModal} // Close the modal when clicking outside the image
        >
          <div className="relative">
            {/* Enlarged Image */}
            <img
              src={enlargedImage}
              alt=""
              className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain cursor-pointer"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />

            {/* Render Change Avatar Button Only for Group Chats */}
            {chatUser?.username === null && (
              <button
                onClick={handleChangeAvatar} // Function to trigger avatar change
                className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
              >
                Change Avatar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatDetail;
