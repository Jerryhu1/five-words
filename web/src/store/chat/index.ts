import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: ChatState = {enabled: false, messages: []};

export interface ChatState {
  messages: Message[];
  enabled: boolean;
}

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
