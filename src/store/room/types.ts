import { Card } from "../card/type";
import { Player, Team } from "../player/types";

export const CREATE_ROOM = "CREATE_ROOM";
export const ADD_PLAYER_TO_ROOM = "ADD_PLAYER_TO_ROOM";
export const SET_ACTIVE_ROOM = "SET_ACTIVE_ROOM";

export interface RoomState {
  name: string;
  owner: string;
  players: Player[];
  teams: Team[];
  scoreGoal: number;
  teamTurn: number;
  currentCard: Card;
  language: string;
}
