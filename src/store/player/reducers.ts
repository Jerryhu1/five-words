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
      players: new Map<string, Player>(),
      points: 0,
    },
    {
      cards: [],
      id: "",
      name: "Blue",
      players: new Map<string, Player>(),
      points: 0,
    },
    {
      cards: [],
      id: "",
      name: "Yellow",
      players: new Map<string, Player>(),
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
  },
};

export const playerReducer = (
  state = initialState,
  action: PlayerActionTypes
): GameState => {
  switch (action.type) {
    // case getType(actions.addPlayer):
    //   return {
    //     ...state,
    //     players: [
    //       ...state.players,
    //       {
    //         ...action.payload,
    //         teamID: "",
    //       },
    //     ],
    //   };
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
    case getType(actions.addTeamPlayerOk):
      // console.log(
      //   ...state.teams.slice(action.payload.teamIndex + 1, state.teams.length)
      // );
      // return {
      //   ...state,
      //   teams: [
      //     ...state.teams.slice(0, action.payload.teamIndex),
      //     {
      //       ...state.teams[action.payload.teamIndex],
      //       players: state.teams[action.payload.teamIndex].players.concat(
      //         action.payload.player
      //       ),
      //     },
      //     ...state.teams.slice(
      //       action.payload.teamIndex + 1,
      //       state.teams.length
      //     ),
      //   ],
      // };
    case getType(actions.removeTeamPlayer):
      // console.log(action.payload.player);
      // if (action.payload.player.teamID == "") {
      //   return state;
      // }
      //
      // const team = state.teams.filter(
      //   (v) => v.id === action.payload.player.teamID
      // )[0];
      // const removeIndex = team.players.findIndex(
      //   (v) => v.id === action.payload.player.id
      // );
      //
      // return {
      //   ...state,
      //   teams: [
      //     ...state.teams.slice(0, action.payload.teamIndex),
      //     {
      //       ...state.teams[action.payload.teamIndex],
      //       players: [
      //         ...state.teams[action.payload.teamIndex].players.slice(
      //           0,
      //           removeIndex
      //         ),
      //         ...state.teams[action.payload.teamIndex].players.slice(
      //           removeIndex + 1,
      //           state.teams[action.payload.teamIndex].players.length
      //         ),
      //       ],
      //     },
      //   ],
      // };
    default:
      return state;
  }
};
