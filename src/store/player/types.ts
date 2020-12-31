export const ADD_TEAM_PLAYER = "ADD_PLAYER_TEAM";
export const ADD_TEAM_PLAYER_OK = "ADD_PLAYER_OK";
export const ADD_PLAYER = "ADD_PLAYER";
export const ADD_TEAM = "ADD_TEAM";
export const FETCH_ACTIVE_PLAYER = "FETCH_ACTIVE_PLAYER";
export const SET_ACTIVE_PLAYER = "SET_ACTIVE_PLAYER";
export const REMOVE_TEAM_PLAYER = "REMOVE_TEAM_PLAYER";
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
