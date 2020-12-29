import { ActionType } from "typesafe-actions";
import { GameState, GameActionTypes, ADD_PLAYER } from "./types";
import * as actions from "./actions";

const initialState: GameState = {
  teams: [],
  players: [],
  winner: -1,
  goalScore: 10,
  turn: 0,
};
export type GameAction = ActionType<typeof actions>;

// export const gameReducer = createReducer<GameState, GameAction>(initialState)
//     .handleAction(loadCards, (state, action) => Object.assign({}, state, { cards: action.payload }) )
//     .handleAction(addPlayer, (state, action) => Object.assign({}, state, { players: action.payload  }))

export const gameReducer = (
  state = initialState,
  action: GameActionTypes
): GameState => {
  switch (action.type) {
    case ADD_PLAYER:
      return {
        ...state,
        players: [...state.players, action.payload],
      };

    default:
      return state;
  }
};
