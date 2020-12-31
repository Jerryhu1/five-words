import { ActionType, getType } from "typesafe-actions";
import { GameState } from "./types";
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
  ],
  players: [],
  winner: -1,
  goalScore: 10,
  turn: 0,
  gameID: "test",
  activePlayer: {
    id: "test",
    name: "test",
  },
};

export const playerReducer = (
  state = initialState,
  action: PlayerActionTypes
): GameState => {
  switch (action.type) {
    case getType(actions.addPlayer):
      return {
        ...state,
        players: [...state.players, action.payload],
      };
    case getType(actions.setActivePlayer):
      console.log(action.payload);
      return {
        ...state,
        activePlayer: {
          name: action.payload.name,
          id: action.payload.id,
        },
      };
    case getType(actions.addTeamPlayerOk):
      return {
        ...state,
        teams: [
          ...state.teams.splice(0, action.payload.teamIndex),
          {
            ...state.teams[action.payload.teamIndex],
            players: state.teams[action.payload.teamIndex].players.concat(
              action.payload.player
            ),
          },
          ...state.teams.splice(
            action.payload.teamIndex + 1,
            state.teams.length
          ),
        ],
      };
    case getType(actions.removeTeamPlayer):
      return {
        ...state,
        teams: [
          ...state.teams.splice(0, action.payload.teamIndex),
          {
            ...state.teams[action.payload.teamIndex],
            players: [
              ...state.teams[action.payload.teamIndex].players.splice(
                0,
                action.payload.playerIndex
              ),
              ...state.teams[action.payload.teamIndex].players.splice(
                action.payload.playerIndex + 1,
                state.teams[action.payload.teamIndex].players.length
              ),
            ],
          },
        ],
      };
    default:
      return state;
  }
};
