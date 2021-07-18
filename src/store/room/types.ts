import {Player, Team} from "../../types/player";
import {Card} from "../../types/card";

export const CREATE_ROOM = "CREATE_ROOM";
export const ADD_PLAYER_TO_ROOM = "ADD_PLAYER_TO_ROOM";
export const SET_ACTIVE_ROOM = "SET_ACTIVE_ROOM";
export const GET_ROOM = "GET_ROOM";
export const SET_ROOM = "SET_ROOM";
export const START_GAME = "START_GAME";

export interface RoomState {
  name: string;
  owner: string;
  players: Map<string, Player>;
  teams: Map<string, Team>;
  scoreGoal: number;
  teamTurn: string;
  currentCard: Card;
  language: string;
  timer: number;
  started: boolean;
  state: State
  currExplainer: string
}

export enum State {
  LOBBY_STANDBY = "LOBBY_STANDBY",
  ROUND_STARTING = "ROUND_STARTING",
  ROUND_ONGOING = "ROUND_ONGOING",
  ROUND_END = "ROUND_END",
  GAME_OVER = "GAME_OVER"
}

export const START_ROUND = "START_ROUND"