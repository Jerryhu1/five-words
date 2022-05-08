import { ChatState } from "./types";
import * as actions from "./actions";
import { ActionType } from "typesafe-actions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ChatActionTypes = ActionType<typeof actions>;

const initialState: ChatState = { enabled: false, messages: [] };

interface Message {
  timestamp: Date;
  text: string;
  playerID: string;
  playerName: string;
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
  },
});

export default chatSlice.reducer;
