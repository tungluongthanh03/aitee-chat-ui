import React, { useSelector } from "react-redux";
import MessageInput from "./MessageInput";
import Blocker from "./Blocker";
import Blocked from "./Blocked";
import { useEffect } from "react";
import { rsBlock } from "../../../redux/apiRequests";

function ChatInput({ chatUser, groupChat, currentUser, dispatch }) {
  const block = useSelector((state) => state.block);

  useEffect(() => {
    rsBlock(dispatch);
  }, [chatUser, groupChat]);

  return (
    <>
      {block.blockerId === null ? (
        <div className="mt-4 flex items-center p-3 bg-gray-800 rounded-full">
          <MessageInput />
        </div>
      ) : block.blockerId === currentUser.id ? (
        <Blocker blockedId={block.blockedId} blockerId={block.blockerId} />
      ) : (
        <Blocked />
      )}
    </>
  );
}

export default ChatInput;
