export const ADD_TEAM_PLAYER = "ADD_TEAM_PLAYER";
export const ADD_TEAM_PLAYER_OK = "ADD_PLAYER_OK";
export const ADD_PLAYER = "ADD_PLAYER";
export const FETCH_ACTIVE_PLAYER = "FETCH_ACTIVE_PLAYER";
export const SET_ACTIVE_PLAYER = "SET_ACTIVE_PLAYER";
export const SET_ACTIVE_PLAYER_ID = "SET_ACTIVE_PLAYER_ID";
export const REMOVE_TEAM_PLAYER = "REMOVE_TEAM_PLAYER";
export interface Player {
  id: string;
  name: string;
  teamID: string;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  players: string[];
  points: number;
  cards: number[];
}

export interface GameState {
  teams: Team[];
  players: Map<string, Player>;
  winner: number;
  goalScore: number;
  turn: number;
  gameID: string;
  activePlayer: Player;
}
