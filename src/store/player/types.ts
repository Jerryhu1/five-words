import { CardActionTypes } from "../card/type";
import { TimerActionTypes } from "../timer/type";

export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  players: number[];
  points: number;
  cards: number[];
}

export interface GameState {
  teams: Team[];
  players: Player[];
  winner: number;
  goalScore: number;
  turn: number;
}

export const ADD_PLAYER_TEAM = "ADD_PLAYER_TEAM";
export const ADD_PLAYER = "ADD_PLAYER";
export const ADD_TEAM = "ADD_TEAM";

interface AddPlayerAction {
  type: typeof ADD_PLAYER;
  payload: Player;
}

interface AddPlayerTeamAction {
  type: typeof ADD_PLAYER_TEAM;
  payload: {
    player: number;
    team: number;
  };
}

interface AddTeamAction {
  type: typeof ADD_TEAM;
  payload: Team;
}

export type GameActionTypes =
  | AddPlayerAction
  | AddPlayerTeamAction
  | AddTeamAction;
