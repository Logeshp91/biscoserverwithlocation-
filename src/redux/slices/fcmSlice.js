import { createSlice } from "@reduxjs/toolkit";

const fcmSlice = createSlice({
  name: "fcm",
  initialState: {
    token: null,
  },
  reducers: {
    setFcmToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setFcmToken } = fcmSlice.actions;
export default fcmSlice.reducer;
