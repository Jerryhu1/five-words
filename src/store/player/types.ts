export const ADD_TEAM_PLAYER = "ADD_TEAM_PLAYER";
export const FETCH_ACTIVE_PLAYER = "FETCH_ACTIVE_PLAYER";
export const SET_ACTIVE_PLAYER_ID = "SET_ACTIVE_PLAYER_ID";

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
  currExplainer: string;
}

