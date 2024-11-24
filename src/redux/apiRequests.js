import { updateChatUser } from "./chatUserSlice";
import { newConversation, updateConversations } from "./conversationsSlice";
import { updateMessages } from "./messagesSlice";
import {updateUser} from "./userSlice";
import axios from "axios";

const url = "http://localhost:3000/api";
let token;

export const getUser = async (dispatch, login) => {
    try {
        const user = (await axios.post(url + `/user/login`, login)).data;
        token = user.accessToken;
        dispatch(updateUser({
            id: user.user.id,
            username: user.user.username,
            avatar: user.user.avatar,
            accessToken: token
        }));
    } catch (e) {
        console.error("Error fetching user:", e);
    }
}

export const getConversations = async (dispatch, userId) => {
    let conversations;
    try {
        conversations = (await axios.get(url + `/chat/conversations`,{
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })).data.conversations;
    } catch (err) {
        console.error("Error fetching conversations:", err);
        conversations = [];
    }
    
    dispatch(updateConversations(conversations));
}

export const addNewConversation = async (dispatch, conversation) => {
    dispatch(newConversation(conversation));
}

export const getChatUser = async (dispatch, user) => {
    const chatUser = {
        username: user.username,
        avatar: user.avatar,
        id: user.id || user.friendid
    }

    dispatch(updateChatUser(chatUser));
}


export const getMessages = async (dispatch, userId) => {
  try {
    const messages = (await axios.get(url + `/chat/messages?userId=${userId}`, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).data.messages;
  dispatch(updateMessages(messages));
  }catch(err) {
    console.error("Error fetching messages:", err);
    dispatch(updateMessages([]));
  }
}

export const addNewMessage = (dispatch, message) => {
  dispatch(addNewMessage(message));
}

export const startChat = async (username) => {
    // Start a new chat with the user
    try {
        const newChat = await axios.post(url + `/chat/new-chat`,{username}, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        return newChat;
    }
    catch(err) {
        console.error("Error starting chat:", err);
        return err.response;
    }
}