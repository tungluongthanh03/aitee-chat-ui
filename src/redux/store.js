import {configureStore} from "@reduxjs/toolkit";
import chatUserReducer from "./chatUserSlice";
import conversationsReducer from "./conversationsSlice";
import userReducer from "./userSlice";
import messagesReducer from "./messagesSlice";
import groupchatReducer from "./groupChatSlice";
import blockReducer from "./blockSlice";
import isMemberReducer from "./isMemberSlice";

export default configureStore({
    reducer: {
        chatUser: chatUserReducer,
        conversations: conversationsReducer,
        user: userReducer,
        messages: messagesReducer,
        groupChat: groupchatReducer,
        block: blockReducer,
        isMember: isMemberReducer
    }
})