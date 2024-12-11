import React, { useState } from "react";
import "../../styles/NewChatPopup.css";
import {
  addMembersToGroupChat,
  getChatTarget,
  searchUser,
} from "../../redux/apiRequests";
import { useDispatch } from "react-redux";
import UserButton from "../UserButton";

const AddMembersPopup = ({ isOpen, onClose, groupID }) => {
  const [searchQuery, setSearchQuery] = useState(""); // search query (username)
  const [listTarget, setListTarget] = useState([]); // list users after searching from server
  const [error, setError] = useState(""); // error
  const [listMembers, setListMembers] = useState([]); // list users, includes uaername, id, avatar -> used to handle logic FE

  const [memberIds, setMemberIds] = useState([]); // send to server, array of user ids

  const dispatch = useDispatch();

  const resetState = () => {
    setSearchQuery("");
    setListTarget([]);
    setListMembers([]);
    setMemberIds([]);
    setError("");
  };

  const handleClickX = () => {
    resetState();
    onClose();
  };

  const handleAddMembers = async () => {
    const newGroup = await addMembersToGroupChat(groupID, memberIds);
    if (newGroup) {
      alert("Added members to group chat successfully!");
      const target = {
        targetId: newGroup.groupID,
        targetName: newGroup.name,
        targetAvatar: newGroup.avatar,
        targetType: "group",
      };
      getChatTarget(dispatch, target);
    } else {
      alert("Failed to add members to group chat! Please try again.");
    }
    resetState();
    onClose();
  };

  const handleFind = async () => {
    const response = await searchUser(searchQuery);
    if (response.data.success) {
      const list = response.data.listTarget.filter(
        (l) => !listMembers.some((t) => t.targetId === l.targetId)
      );
      setListTarget(list);
    } else {
      setError(response.data.message);
      setListTarget([]);
    }
  };

  const removeUser = (user) => {
    setListMembers(listMembers.filter((t) => t.targetId !== user.targetId));
    setMemberIds(memberIds.filter((id) => id !== user.targetId));
    setListTarget([...listTarget, user]);
  };

  const handleChoose = (target) => {
    setListMembers([...listMembers, target]);
    setMemberIds([...memberIds, target.targetId]);
    setListTarget(listTarget.filter((t) => t.targetId !== target.targetId));
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">New Members</h2>
          <button className="popup-close" onClick={handleClickX}>
            ✖
          </button>
        </div>
        <div>
          {listMembers.length !== 0 && (
            <div className="flex flex-wrap">
              {listMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-3 rounded-lg bg-gray-800 m-2"
                >
                  <UserButton
                    id={member.targetId}
                    username={member.targetName}
                    func={() => removeUser(member)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3">
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
            className="popup-button font-bold w-1/2"
            onClick={handleFind}
            disabled={searchQuery === ""}
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
          onClick={handleAddMembers}
          disabled={listMembers.length === 0}
        >
          Add Members
        </button>
      </div>
    </div>
  );
};

export default AddMembersPopup;
