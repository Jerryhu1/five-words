import {ActionType, getType} from "typesafe-actions";
import {Player, Team} from "../player/types";
import * as actions from "./actions";
import {RoomState, State} from "./types";

export type RoomActionTypes = ActionType<typeof actions>;

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
  currExplainer: ""
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
      const players = new Map<string, Player>(Object.entries(action.payload.newState.players))
      const teams = new Map<string, Team>(Object.entries(action.payload.newState.teams))
      return {
        ...state,
        ...action.payload.newState,
        players: players,
        teams: teams
      }
    default:
      return state;
  }
};
