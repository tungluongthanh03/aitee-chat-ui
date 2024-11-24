import {configureStore} from "@reduxjs/toolkit";
import chatUserReducer from "./chatUserSlice";
import conversationsReducer from "./conversationsSlice";
import userReducer from "./userSlice";
import messagesReducer from "./messagesSlice";

export default configureStore({
    reducer: {
        chatUser: chatUserReducer,
        conversations: conversationsReducer,
        user: userReducer,
        messages: messagesReducer,
    }
})