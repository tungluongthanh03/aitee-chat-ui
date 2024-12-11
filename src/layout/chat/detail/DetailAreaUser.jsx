import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeBlock } from "../../../redux/apiRequests";

function DetailAreaUser({ chatUserId, currentUserId }) {
  const dispatch = useDispatch();
  const blo = useSelector((state) => state.block);

  const block = (chatUserId) => {
    changeBlock(dispatch, chatUserId, currentUserId);
  };

  const report = (chatUserId) => {};
  return (
    <>
      {/* <button className="w-full bg-emerald-500 text-white font-bold py-2 rounded-lg hover:bg-emerald-700">
        Report
      </button> */}
      <button
        className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700"
        onClick={() => block(chatUserId)}
      >
        {blo.blockedId === null ? "Block" : "Unblock"}
      </button>
    </>
  );
}

export default DetailAreaUser;
