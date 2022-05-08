import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomState, State } from "./types";
import { Player, Team } from "../../types/player";
import { RootState } from "../index";

// Define the initial state using that type
const initialState: RoomState = {
  name: "",
  owner: "",
  players: new Map<string, Player>(),
  teams: new Map<string, Team>(),
  scoreGoal: 0,
  teamTurn: "",
  currentCard: {
    id: "",
    words: [],
    correct: 0,
  },
  language: "",
  timer: 0,
  started: false,
  state: State.LOBBY_STANDBY,
  currExplainer: "",
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<RoomState>) => {
      state = action.payload;
    },
  },
});

export const { setRoom } = roomSlice.actions;

export default roomSlice.reducer;
