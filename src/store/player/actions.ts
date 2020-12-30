import {
  ADD_PLAYER,
  ADD_TEAM_PLAYER,
  FETCH_ACTIVE_PLAYER,
  GameActionTypes,
  Player,
  SET_ACTIVE_PLAYER,
} from "./types";
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

export const fetchActivePlayer = (name: string): GameActionTypes => ({
  type: FETCH_ACTIVE_PLAYER,
  payload: name,
});

export const setActivePlayer = (player: Player): GameActionTypes => ({
  type: SET_ACTIVE_PLAYER,
  payload: player,
});

export const addTeamPlayer = (
  playerID: string,
  teamID: string
): GameActionTypes => ({
  type: ADD_TEAM_PLAYER,
  payload: {
    playerID: playerID,
    teamID: teamID,
  },
});
