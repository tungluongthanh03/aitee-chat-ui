import {configureStore} from "@reduxjs/toolkit";
import chatUserReducer from "./chatUserSlice";
import postReducer from "./postSlice";

export default configureStore({
    reducer: {
        chatUser: chatUserReducer,
        post: postReducer,
        
    }
})