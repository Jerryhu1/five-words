import { CardActionTypes } from "../card/type";
import { TimerActionTypes } from "../timer/type";

export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  points: number;
  cards: number[];
}

export interface GameState {
  teams: Team[];
  players: Player[];
  winner: number;
  goalScore: number;
  turn: number;
  gameID: string;
  activePlayer: Player;
}

export const ADD_TEAM_PLAYER = "ADD_PLAYER_TEAM";
export const ADD_PLAYER = "ADD_PLAYER";
export const ADD_TEAM = "ADD_TEAM";
export const FETCH_ACTIVE_PLAYER = "FETCH_ACTIVE_PLAYER";
export const SET_ACTIVE_PLAYER = "SET_ACTIVE_PLAYER";

interface AddPlayerAction {
  type: typeof ADD_PLAYER;
  payload: Player;
}

interface ADD_TEAM_PLAYER {
  type: typeof ADD_TEAM_PLAYER;
  payload: {
    playerID: string;
    teamID: string;
  };
}

interface AddTeamAction {
  type: typeof ADD_TEAM;
  payload: Team;
}

interface FetchActivePlayer {
  type: typeof FETCH_ACTIVE_PLAYER;
  payload: string;
}

interface SetActivePlayer {
  type: typeof SET_ACTIVE_PLAYER;
  payload: Player;
}

export type GameActionTypes =
  | AddPlayerAction
  | ADD_TEAM_PLAYER
  | AddTeamAction
  | FetchActivePlayer
  | SetActivePlayer;
