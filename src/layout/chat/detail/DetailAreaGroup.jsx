import React, { useEffect, useState } from "react";
import {
  addNewConversation,
  dissolveGroupChat,
  getChatTarget,
  getGroupDetail,
  getMembers,
  getMessages,
  leaveGroupChat,
  removeMemberFromGroupChat,
} from "../../../redux/apiRequests";
import AddMembersPopup from "../../popup/AddMembersPopup";
import { useDispatch } from "react-redux";
import { useSocket } from "../../SocketContext";

function DetailAreaGroup({ groupChat, currentUser }) {
  const [members, setMembers] = useState([]);
  const [details, setDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const socket = useSocket();

  const dispatch = useDispatch();

  const reset = () => {
    setMembers([]);
    setDetails(null);
  };

  const seeMembers = async () => {
    if (members.length > 0) {
      setMembers([]);
    } else {
      let list = await getMembers(groupChat.id);
      list = list.filter((member) => member.userid !== currentUser.id);
      setMembers(list);
    }
  };

  const removeMember = async (memberId) => {
    const newGroup = await removeMemberFromGroupChat(groupChat.id, memberId);
    if (newGroup) {
      alert("Removed member from group chat successfully!");
      const target = {
        targetId: newGroup.groupID,
        targetName: newGroup.name,
        targetAvatar: newGroup.avatar,
        targetType: "group",
      };
      getChatTarget(dispatch, target);
      members.filter((member) => member.userid !== memberId);
      setMembers(members);
    } else {
      alert("Failed to remove member from group chat!");
    }
  };

  const handleDissolve = async () => {
    const res = await dissolveGroupChat(groupChat.id);
    if(res?.success) {
      console.log("Dissolved group chat successfully!");
    } else {
      console.error("Failed to dissolve group chat!");
    }
  }

  const handleLeaveGroup = async () => {
    const newGroup = await leaveGroupChat(groupChat.id);
    if (newGroup) {
      alert("Left group chat successfully!");
      const target = {
        targetId: newGroup.groupID,
        targetName: newGroup.name,
        targetAvatar: newGroup.avatar,
        targetType: "group",
        lastMessage: "You left the group",
        createdAt: new Date().toISOString(),
      };
      addNewConversation(dispatch, target);
      getMessages(dispatch, newGroup.groupID);
      const groupID = newGroup.groupID;
      socket.emit("leave-group", groupID);
    } else {
      alert("Failed to leave group chat!");
    }
  };

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    async function fetchDetails() {
      const groupDetails = await getGroupDetail(groupChat.id);
      setDetails(groupDetails);
    }
    fetchDetails();
  }, [groupChat]);

  useEffect(() => {
    reset();
  }, [groupChat]);

  return (
    <>
      <div>
        <button
          className="w-full bg-emerald-500 text-white font-bold py-2 rounded-lg hover:bg-emerald-700"
          onClick={seeMembers}
        >
          See members
        </button>
        {members?.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2"
          >
            <div className="flex items-center">
              <img
                src={
                  member.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full mr-2"
              />
              <span className="text-lg font-semibold">{member.username}</span>
            </div>
            {currentUser.id === details?.createBy.id && (
              <button
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
                onClick={() => removeMember(member.userid)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        className="w-full bg-emerald-500 text-white font-bold py-2 rounded-lg hover:bg-emerald-700"
        onClick={open}
      >
        Add member
      </button>
      <AddMembersPopup isOpen={isOpen} onClose={close} groupID={groupChat.id} />
      {currentUser.id === details?.createBy.id ? (
        <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700" onClick={handleDissolve}>
          Dissolve Group
        </button>
      ) : (
        <button
          className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
          onClick={handleLeaveGroup}
        >
          Leave Group
        </button>
      )}
    </>
  );
}

export default DetailAreaGroup;
