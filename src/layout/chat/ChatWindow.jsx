import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoTarget from "./NoTarget";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./input/ChatInput";
import { addNewConversation, getBlock, getChatTarget, getMessages, resetTarget } from "../../redux/apiRequests";
import ChatDetail from "./detail/ChatDetail";
import { useSocket } from "../SocketContext";
import LoadingIcon from "../LoadingIcon";

const ChatWindow = () => {
  const [showDetail, setShowDetail] = useState(false);

  const socket = useSocket();

  const currentUser = useSelector((state) => state.user);
  const chatUser = useSelector((state) => state.chatUser);
  const groupChat = useSelector((state) => state.groupChat);
  const isMember = useSelector((state) => state.isMember);

  const dispatch = useDispatch();

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  // get messages when user changes the chat window to another user or group
  useEffect(() => {
    if (chatUser.id || groupChat.id) {
      getMessages(dispatch, chatUser.id || groupChat.id);
      if (chatUser.id) {
        getBlock(dispatch, chatUser.id);
      }
    }
  }, [chatUser.id, groupChat.id]);

  useEffect(() => {
    if(socket) {
      socket.on("added-to-group", data => {
        const {group} = data;
        alert(`You were added to group ${group.name} successfully!`);
        const target = {
          targetId: group.groupID,
          targetName: group.name,
          targetAvatar: group.avatar,
          targetType: "group",
          lastMessage: "You were added to group",
          createdAt: new Date().toISOString(),
        };
        addNewConversation(dispatch, target);
        if(groupChat.id === group.groupID) {
          getMessages(dispatch, group.groupID);
        }

        socket.emit("join-group", group.groupID);
        socket.off("receivedMessageGroup");
      })

      socket.on("removed-from-group", savedGroupChat => {
        const {name, groupID, avatar} = savedGroupChat;
        alert(`You were removed from group ${name}!`);
        const target = {
          targetId: groupID,
          targetName: name,
          targetAvatar: avatar,
          targetType: "group",
          lastMessage: "You were removed from group",
          createdAt: new Date().toISOString(),
        };  
        addNewConversation(dispatch, target);
        if(groupChat.id === groupID) {
          getMessages(dispatch, groupID);
        }
        socket.emit("leave-group", groupID);
      })

      socket.on("dissolve-group", group => {
        const {name, groupID, avatar} = group;
        alert(`Group ${name} was dissolved by its admin!`);
        const target = {
          targetId: groupID,
          targetName: name,
          targetAvatar: avatar,
          targetType: "group",
          lastMessage: "Group was dissolved",
          createdAt: new Date().toISOString(),
        };
        addNewConversation(dispatch, target);
        if(groupChat.id === groupID) {
          resetTarget(dispatch);
        }
        socket.emit("leave-group", groupID);
      })

      socket.on("new-group", newGroupChat => {
        const {name, groupID, avatar} = newGroupChat;
        alert(`You were added to a new group ${name}!`);
        const target = {
          targetId: groupID,
          targetName: name,
          targetAvatar: avatar,
          targetType: "group",
          lastMessage: "New group created",
          createdAt: new Date().toISOString(),
        };
        addNewConversation(dispatch, target);
        socket.emit("join-group", groupID);
      })

      socket.on("update-group-avatar", group => {
        const {groupID, avatar, name} = group;
        const target = {
          targetId: groupID,
          targetName: name,
          targetAvatar: avatar,
          targetType: "group",
          lastMessage: "Update group avatar",
          createdAt: new Date().toISOString(),
        }
        addNewConversation(dispatch, target);

        if(groupChat.id === groupID) {
          getChatTarget(dispatch, target);
        }        
      })

      socket.on("update-group-name", group => {
        const {groupID, avatar, name} = group;
        const target = {
          targetId: groupID,
          targetName: name,
          targetAvatar: avatar,
          targetType: "group",
          lastMessage: "Update group name",
          createdAt: new Date().toISOString(),
        }
        addNewConversation(dispatch, target);

        if(groupChat.id === groupID) {
          getChatTarget(dispatch, target);
        }        
      })

      return () => {
        socket.off("added-to-group");
        socket.off("removed-from-group");
        socket.off("dissolve-group");
        socket.off("new-group");
        socket.off("update-group-avatar");
        socket.off("update-group-name");
      }
    }
  })

  if (!chatUser || !groupChat) {
    return <div><LoadingIcon /></div>;
  }

  if (isMember.isMember === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-center rounded-lg shadow-lg w-full">
        <div className="text-4xl font-bold text-red-500 mb-4">
          🚫 Access Denied
        </div>
        <p className="text-white text-lg mb-4">
          You are no longer a member of this group.
        </p>
      </div>
    );
  }

  if (isMember.isGroup === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-center rounded-lg shadow-lg w-full">
        <div className="text-4xl font-bold text-red-500 mb-4">
          🚫 Access Denied
        </div>
        <p className="text-white text-lg mb-4">
          This group is no longer available.
        </p>
      </div>
    );
  }
  

  

  return (
    <div className="flex h-full w-full">
      {/* Main Chat Area */}
      {chatUser.id == null && groupChat.id == null ? (
        <NoTarget dispatch={dispatch} />
      ) : (
        <>
          <div
            className={`bg-black text-white p-4 flex flex-col ${
              showDetail ? "w-2/3" : "w-full"
            } h-full`}
          >
            {/* Chat Header */}
            <ChatHeader
              chatUser={chatUser}
              groupChat={groupChat}
              toggleDetail={toggleDetail}
            />

            {/* Chat Messages */}
            <ChatMessages
              chatUser={chatUser}
              groupChat={groupChat}
              currentUser={currentUser}
              dispatch={dispatch}
            />

            {/* Message Input */}
            <ChatInput chatUser={chatUser} groupChat={groupChat} currentUser={currentUser} dispatch={dispatch}/>
          </div>

          {/* Detail Area */}
          {showDetail && (
            <ChatDetail
              chatUser={chatUser}
              groupChat={groupChat}
              currentUser={currentUser}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ChatWindow;
