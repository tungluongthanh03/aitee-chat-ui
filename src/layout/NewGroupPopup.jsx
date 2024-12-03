import React, { useState } from "react";
import "../styles/NewChatPopup.css";
import { createGroup, searchUser, searchUserOrGroup } from "../redux/apiRequests";
import UserButton from "./UserButton";
import { useSelector } from "react-redux";

const NewGroupPopup = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState(""); // search query (username)
  const [listTarget, setListTarget] = useState([]); // list users after searching from server
  const [error, setError] = useState(""); // error
  const [name, setName] = useState(""); // group name
  const [listMembers, setListMembers] = useState([]); // list users, includes uaername, id, avatar -> used to handle logic FE

  const currentUser = useSelector(state => state.user);
  const [listUserIds, setListUserIds] = useState([currentUser.id]); // send to server, array of user ids
  
  const resetState = () => {
    setSearchQuery("");
    setListTarget([]);
    setListMembers([]);
    setListUserIds([currentUser.id]);
    setError("");
    setName("");
  }

  const handleClickX = () => {
    resetState();
    onClose();
  };

  const handleCreateGroup = () => {
    createGroup(listUserIds, name);
    // console.log(listUserIds, name);
    resetState();
    onClose();
  };

  const handleFind = async () => {
    const response = await searchUser(searchQuery);
    if (response.data.success) {
      const list = response.data.listTarget.filter(l =>!listMembers.some(t => t.targetId === l.targetId));
      setListTarget(list);
    } else {
      setError(response.data.message);
      setListTarget([]);
    }
  };

  const removeUser = (user) => {
    setListMembers(listMembers.filter((t) => t.targetId !== user.targetId));
    setListUserIds(listUserIds.filter((id) => id !== user.targetId));
    setListTarget([...listTarget, user]);
  }

  const handleChoose = (target) => {
    setListMembers([...listMembers, target]);
    setListUserIds([...listUserIds, target.targetId]);
    setListTarget(listTarget.filter((t) => t.targetId !== target.targetId));
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">New Group</h2>
          <button className="popup-close" onClick={handleClickX}>
            ✖
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter the group name..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="popup-input"
          />
        </div>
        <div>
          {listMembers.length !== 0 && (
            <div className="flex flex-wrap">
              {listMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-3 rounded-lg bg-gray-800 m-2"
                >
                  <UserButton id={member.targetId} username={member.targetName} func={() => removeUser(member)}/>
                </div>
              ))}
              </div>
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Type a username..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setError("");
            }}
            className="popup-input"
          />
          <button
            className="popup-button font-bold"
            onClick={handleFind}
            disabled={searchQuery == ""}
          >
            Find User
          </button>
        </div>
        {listTarget.length !== 0 ? (
          <div className="popup-list">
            {listTarget.map((target) => (
              <div
                key={target.targetId}
                onClick={() => handleChoose(target)}
                className={`flex items-center p-3 rounded-lg transition cursor-pointer my-2 hover:bg-gray-800`}
              >
                <img
                  src={target.targetAvatar}
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
          onClick={handleCreateGroup}
          disabled={name == "" || listMembers.length < 2}
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default NewGroupPopup;
