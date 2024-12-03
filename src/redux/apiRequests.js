import { resetChatUser, updateChatUser } from "./chatUserSlice";
import { newConversation, updateConversations } from "./conversationsSlice";
import { resetGroupChat, updateGroupChat } from "./groupChatSlice";
import { newMessage, updateMessages } from "./messagesSlice";
import { resetUser, updateUser } from "./userSlice";
import axios from "axios";

const url = "http://localhost:3000/api";
let token;

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
      const list = (await axios.get(url + "/chat/members?groupId=" + groupId, {
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
}

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
  } catch (err) {
    console.error("Error fetching messages:", err);
    dispatch(updateMessages([]));
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
    await axios.post(
      url + "/chat/create-group",
      { listUserIds, name },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
  }catch(e) {
    console.error("Error creating group:", e);
  }
};

export const getGroupDetail = async (groupId) => {
  try {
    const details = (await axios.get(url + "/chat/group-details?groupId=" + groupId, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })).data.details;
    console.log("details", details);
    return details;
  } catch (e) {
    console.error("Error getting group detail:", e);
    return null;
  }
}
