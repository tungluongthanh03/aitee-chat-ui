import { createSlice } from "@reduxjs/toolkit";

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState: {
    list: [],
  },
  reducers: {
    updateConversations: (state, action) => {
      state.list = action.payload;
    },

    newConversation: (state, action) => {
      state.list = state.list.filter(
        (conversation) => conversation.targetId !== action.payload.targetId
      );
    
      state.list.unshift(action.payload);
    },
  },
});

export const { updateConversations, newConversation } =
  conversationsSlice.actions;
export default conversationsSlice.reducer;
