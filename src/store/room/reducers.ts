import { ActionType, getType } from "typesafe-actions";
import { Player, Team } from "../player/types";
import * as actions from "./actions";
import { RoomState } from "./types";

export type RoomActionTypes = ActionType<typeof actions>;

const initialState: RoomState = {
  name: "",
  owner: "",
  players: new Map<string, Player>(),
  teams: new Map<string, Team>(),
  scoreGoal: 0,
  teamTurn: 0,
  currentCard: {
    id: "",
    words: [],
    correct: 0,
  },
  language: "",
};

export const roomReducer = (
  state = initialState,
  action: RoomActionTypes
): RoomState => {
  switch (action.type) {
    case getType(actions.setActiveRoom):
      return {
        ...state,
        ...action.payload,
      };
    case getType(actions.setRoom):
      return {
        ...state,
        ...action.payload.newState
      }
    default:
      return state;
  }
};
