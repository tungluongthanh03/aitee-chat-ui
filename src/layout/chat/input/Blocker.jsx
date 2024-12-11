import React, {  } from "react";
import "../../../styles/UserButton.css";
import { changeBlock } from "../../../redux/apiRequests";
import { useDispatch } from "react-redux";

const Blocker = ({ blockerId, blockedId }) => {
  const dispatch = useDispatch();
  const Unblock = async (blockedId) => {
    await changeBlock(dispatch, blockedId, blockerId);
  };
  return (
    <div className="flex">
      <div>
        <p>You blocked this user! Good decision!.</p>
      </div>
      <div>
        <button
          className="close-btn bg-green-700 text-white font-bold"
          onClick={() => Unblock(blockedId)}
        >
          Unblock
        </button>
      </div>
    </div>
  );
};

export default Blocker;
