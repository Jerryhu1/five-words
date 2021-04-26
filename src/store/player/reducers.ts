import { ActionType, getType } from "typesafe-actions";
import { GameState, Player } from "./types";
import * as actions from "./actions";
export type PlayerActionTypes = ActionType<typeof actions>;

const initialState: GameState = {
  teams: [
    {
      cards: [],
      id: "",
      name: "Red",
      players: [],
      points: 0,
    },
    {
      cards: [],
      id: "",
      name: "Blue",
      players: [],
      points: 0,
    },
    {
      cards: [],
      id: "",
      name: "Yellow",
      players: [],
      points: 0,
    },
  ],
  players: new Map<string, Player>(),
  winner: -1,
  goalScore: 10,
  turn: 0,
  gameID: "test",
  activePlayer: {
    id: "",
    name: "",
    teamID: "",
    isActive: false
  },
};

export const playerReducer = (
  state = initialState,
  action: PlayerActionTypes
): GameState => {
  switch (action.type) {
    case getType(actions.setActivePlayer):
      return {
        ...state,
        activePlayer: {
          ...state.activePlayer,
          name: action.payload.name,
          teamID: action.payload.teamID,
        },
      };
    case getType(actions.setActivePlayerId):
      return {
        ...state,
        activePlayer: {
          ...state.activePlayer,
          id: action.payload.id
        },
      };
    default:
      return state;
  }
};
