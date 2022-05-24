import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SessionState = {
  sessionID: string;
  activePlayer: string;
};

const initialState: SessionState = {
  sessionID: "",
  activePlayer: "",
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ sessionID: string }>) => {
      state.sessionID = action.payload.sessionID;
    },
    setActivePlayer: (state, action: PayloadAction<{ name: string }>) => {
      state.activePlayer = action.payload.name;
    },
  },
});
export const { setSession, setActivePlayer } = sessionSlice.actions
export default sessionSlice.reducer;
