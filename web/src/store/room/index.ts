import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Player, Team} from "../../types/player";
import {Card} from "../../types/card";

export enum State {
  LOBBY_STANDBY = "LOBBY_STANDBY",
  ROUND_STARTING = "ROUND_STARTING",
  ROUND_ONGOING = "ROUND_ONGOING",
  ROUND_END = "ROUND_END",
  GAME_OVER = "GAME_OVER",
}

export interface RoomState {
  name: string;
  owner: string;
  players: PlayerMap;
  teams: TeamMap;
  scoreGoal: number;
  teamTurn: string;
  currentCard: Card;
  language: string;
  timer: number;
  started: boolean;
  state: State;
  currExplainer: string;
}

export type PlayerMap = { [key: string]: Player };
export type TeamMap = { [key: string]: Team };
// Define the initial state using that type
const initialState: RoomState = {
  name: "",
  owner: "",
  players: {},
  teams: {},
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
      return action.payload
    },
  },
});

export const {setRoom} = roomSlice.actions;

export default roomSlice.reducer;
