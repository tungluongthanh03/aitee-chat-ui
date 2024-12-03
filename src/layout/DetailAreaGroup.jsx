import React, { useEffect, useState } from "react";
import { getGroupDetail, getMembers } from "../redux/apiRequests";

function DetailAreaGroup({ groupChat, currentUser }) {
  const [members, setMembers] = useState([]);
  const [details, setDetails] = useState(null);


  const seeMembers = async () => {
    const list = await getMembers(groupChat.id);
    setMembers(list);
    const det = await getGroupDetail(groupChat.id);
    console.log(det.createBy);
    setDetails(det);
  };


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
                src={member.avatar || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full mr-2"
              />
              <span className="text-lg font-semibold">{member.username}</span>
            </div>
            {currentUser.id === details?.createBy.id && (
                <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                    Remove
                </button>
            )}
          </div>
        ))}
      </div>

      <button className="w-full bg-emerald-500 text-white font-bold py-2 rounded-lg hover:bg-emerald-700">
        Add member
      </button>
      <button className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700">
        Leave Group
      </button>
      <button className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700">
        Delete Chat
      </button>
    </>
  );
}

export default DetailAreaGroup;
