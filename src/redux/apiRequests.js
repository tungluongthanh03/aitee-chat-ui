import { resetBlock, updateBlock } from "./blockSlice";
import { resetChatUser, updateChatUser } from "./chatUserSlice";
import { newConversation, updateConversations } from "./conversationsSlice";
import { resetGroupChat, updateGroupChat } from "./groupChatSlice";
import {
  resetStatus,
  resetStatusGroup,
  updateStatus,
  updateStatusGroup,
} from "./isMemberSlice";
import {
  handledMediaMessage,
  moreMessage,
  newMessage,
  updateMessages,
} from "./messagesSlice";
import { resetUser, updateUser } from "./userSlice";
import axios from "axios";

const url = "http://localhost:3000/api";
let token;
// const token = sessionStorage.getItem('keyToken');

export const getUser = async (dispatch, login) => {
  try {
    const user = (await axios.post(url + `/user/login`, login)).data;
    token = user.accessToken;
    dispatch(
      updateUser({
        id: user.user.id,
        username: user.user.username,
        avatar: user.user.avatar,
        accessToken: token,
      })
    );
  } catch (e) {
    console.error("Error fetching user:", e);
  }
};

export const logout = (dispatch) => {
  token = null;
  dispatch(resetUser());
};

export const getConversations = async (dispatch) => {
  let conversations;
  try {
    conversations = (
      await axios.get(url + `/chat/conversations`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
    ).data.conversations;
  } catch (err) {
    console.error("Error fetching conversations:", err);
    conversations = [];
  }

  dispatch(updateConversations(conversations));
};

export const addNewConversation = async (dispatch, conversation) => {
  dispatch(newConversation(conversation));
};

export const getMembers = async (groupId) => {
  try {
    const list = (
      await axios.get(url + "/chat/members?groupId=" + groupId, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
    ).data.list;
    return list;
  } catch (e) {
    console.error("Error fetching members:", e);
    return [];
  }
};

export const getChatTarget = async (dispatch, target) => {
  if (target.targetType === "user") {
    const chatUser = {
      username: target.targetName,
      avatar: target.targetAvatar,
      id: target.targetId,
    };
    dispatch(updateChatUser(chatUser));
    dispatch(resetGroupChat());
  } else {
    const list = await getMembers(target.targetId);
    const groupChat = {
      name: target.targetName,
      avatar: target.targetAvatar,
      id: target.targetId,
      list: list,
    };
    dispatch(updateGroupChat(groupChat));
    dispatch(resetChatUser());
  }
};

export const resetTarget = (dispatch) => {
  dispatch(resetChatUser());
  dispatch(resetGroupChat());
};

export const getMessages = async (dispatch, userId) => {
  try {
    const messages = (
      await axios.get(url + `/chat/messages?userId=${userId}`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
    ).data.messages;
    dispatch(updateMessages(messages));
    dispatch(resetStatus());
    dispatch(resetStatusGroup());
  } catch (err) {
    console.error("Error fetching messages:", err);
    if (err.response.data.message === "You are not a member of this group") {
      dispatch(updateStatus());
    }
    if (err.response.data.message === "User or group not found") {
      dispatch(updateStatusGroup());
    }
    dispatch(updateMessages([]));
  }
};

export const loadMoreMessages = async (dispatch, userId, offset) => {
  try {
    const messages = (
      await axios.get(
        url + `/chat/messages?userId=${userId}&offset=${offset}`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
    ).data.messages;
    dispatch(moreMessage(messages));
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
};

export const addNewMessage = (dispatch, message) => {
  dispatch(newMessage(message));
};

export const searchUserOrGroup = async (username) => {
  try {
    const newChat = await axios.post(
      url + `/chat/search`,
      { username },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    return newChat;
  } catch (err) {
    console.error("Error starting chat:", err);
    return err.response;
  }
};

export const addHandledMediaMessage = (dispatch, media) => {
  dispatch(handledMediaMessage(media));
};

export const searchUser = async (username) => {
  try {
    const list = await axios.post(
      url + `/chat/search-only-user`,
      { username },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    return list;
  } catch (err) {
    console.error("Error starting chat:", err);
    return err.response;
  }
};

export const createGroup = async (listUserIds, name) => {
  try {
    const group = (
      await axios.post(
        url + "/chat/create-group",
        { listUserIds, name },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
    ).data.groupChat;
    return group;
  } catch (e) {
    console.error("Error creating group:", e);
    return null;
  }
};

export const getGroupDetail = async (groupId) => {
  try {
    const details = (
      await axios.get(url + "/chat/group-details?groupId=" + groupId, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
    ).data.details;
    return details;
  } catch (e) {
    console.error("Error getting group detail:", e);
    return null;
  }
};

export const getBlock = async (dispatch, targetId) => {
  try {
    const block = (
      await axios.get(url + `/chat/block?targetId=${targetId}`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
    ).data.block;
    dispatch(updateBlock(block));
  } catch (e) {
    console.error("Error getting block:", e);
  }
};

export const changeBlock = async (dispatch, blockedId, blockerId) => {
  try {
    const blockMess = (
      await axios.post(
        url + `/friend/block/${blockedId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
    ).data.message;
    if (blockMess === "User unblocked successfully.") {
      dispatch(resetBlock());
    } else {
      dispatch(updateBlock({ blockerId, blockedId }));
    }
  } catch (e) {
    console.error("Error changing block:", e);
  }
};

export const rsBlock = (dispatch) => {
  dispatch(resetBlock());
};

export const addMembersToGroupChat = async (groupID, memberIds) => {
  try {
    const res = await axios.post(
      url + "/chat/add-members",
      { groupID, memberIds },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.groupChat;
  } catch (e) {
    console.error("Error adding member to group chat:", e);
    return null;
  }
};

export const removeMemberFromGroupChat = async (groupID, memberId) => {
  try {
    const res = await axios.post(
      url + "/chat/remove-member",
      { groupID, memberId },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.groupChat;
  } catch (e) {
    console.error("Error removing member from group chat:", e);
    return null;
  }
};

export const leaveGroupChat = async (groupID) => {
  try {
    const res = await axios.post(
      url + "/chat/leave-group",
      { groupID },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.groupChat;
  } catch (e) {
    console.error("Error leaving group chat:", e);
    return null;
  }
};

export const dissolveGroupChat = async (groupID) => {
  try {
    const res = (
      await axios.post(
        url + "/chat/dissolve-group",
        { groupID },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
    ).data;
    return res;
  } catch (e) {
    console.error("Error dissolving group chat:", e);
    return e.response.data;
  }
};

export const updateGroupAvatar = async (formData) => {
  try {
    const res = await axios.post(url + "/chat/update-group-avatar", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (e) {
    console.error("Error updating group avatar:", e);
    return e.response.data;
  }
};

export const updateGroupName = async (groupID, name) => {
  try {
    const res = await axios.post(
      url + "/chat/update-group-name",
      { groupID, name },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (e) {
    console.error("Error updating group name:", e);
    return e.response.data;
  }
};
