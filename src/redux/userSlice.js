import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    username: null,
    avatar:
      null,
    // accessToken: null,
  },
  reducers: {
    updateUser: (state, action) => {
      state.username = action.payload.username;
      state.avatar = action.payload.avatar || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png";
      state.id = action.payload.id;
      // state.accessToken = action.payload.accessToken;
    },
    resetUser: (state) => {
      state.username = null;
      state.avatar = null;
      state.id = null;
      // state.accessToken = null;
    }
  },
});

export const { updateUser, resetUser } =
  userSlice.actions;
export default userSlice.reducer;
