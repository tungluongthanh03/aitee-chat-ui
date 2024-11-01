import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        title: "add a title",
        desc: "add a description",
        tag: "",
        pending: false,
        error: false
    },
    reducers: {
        postStart: (state) => {
            state.pending = true;
            state.error = false;
        },
        postError: (state) => {
            state.pending = false;
            state.error = true;
        },
        postSuccess: (state, action) => {
            state.posts = [...state.posts, action.payload];
            state.title = action.payload.title;
            state.desc = action.payload.desc;
            state.tag = action.payload.tag;
            state.pending = false;
            state.error = false;
        }
    }
})

export const {postError, postStart, postSuccess} = postSlice.actions;
export default postSlice.reducer;