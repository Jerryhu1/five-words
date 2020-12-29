import { ADD_PLAYER, GameActionTypes } from "./types";
import cuid from "cuid";

// export const loadCards = createAction('LOAD_CARD')<Card[]>();
// export const addPlayer = createAction('ADD_PLAYER', (name: string) =>
//     ({ id: cuid(), name: name }))<Player>();

export const addPlayer = (name: string): GameActionTypes => ({
  type: ADD_PLAYER,
  payload: {
    id: cuid(),
    name: name,
  },
});
